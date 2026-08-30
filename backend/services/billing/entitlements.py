"""
backend/services/billing/entitlements.py

Entitlement management and authoritative usage reconciliation.
Enforces multi-tenant feature flags, quotas, and limits.
"""

import uuid
from datetime import datetime, timezone, timedelta
from typing import Dict, Any, NamedTuple, Optional
from sqlalchemy import select, func, update
from sqlalchemy.ext.asyncio import AsyncSession

from db.models.workspace import Workspace
from db.models.subscription import Subscription
from db.models.usage_event import UsageEvent

PLAN_ENTITLEMENTS: Dict[str, Dict[str, Any]] = {
    "free": {
        "monthly_analyses": 10,
        "can_use_topic_intelligence": True,
        "can_connect_youtube": False,
        "max_projects": 1,
        "max_team_members": 1,
        "history_retention_days": 30
    },
    "pro": {
        "monthly_analyses": 100,
        "can_use_topic_intelligence": True,
        "can_connect_youtube": True,
        "max_projects": 10,
        "max_team_members": 3,
        "history_retention_days": 365
    },
    "studio": {
        "monthly_analyses": 500,
        "can_use_topic_intelligence": True,
        "can_connect_youtube": True,
        "max_projects": 50,
        "max_team_members": 10,
        "history_retention_days": -1  # Unlimited
    }
}


class QuotaCheckResult(NamedTuple):
    allowed: bool
    used: int
    limit: int
    remaining: int
    plan: str


class EntitlementService:
    @staticmethod
    def get_plan_limits(plan_tier: str) -> Dict[str, Any]:
        """Returns the entitlement dictionary for a given plan tier."""
        tier = (plan_tier or "free").lower()
        return PLAN_ENTITLEMENTS.get(tier, PLAN_ENTITLEMENTS["free"])

    async def check_analysis_quota(
        self,
        db: AsyncSession,
        workspace_id: uuid.UUID
    ) -> QuotaCheckResult:
        """
        Authoritatively counts usage events within the current billing cycle
        and verifies whether the workspace is permitted to run another analysis.
        Reconciles the cached counter if out of sync.
        """
        # Fetch workspace subscription
        stmt = select(Subscription).where(Subscription.workspace_id == workspace_id)
        sub = await db.scalar(stmt)

        plan = sub.plan if sub else "free"
        limits = self.get_plan_limits(plan)
        monthly_limit = limits["monthly_analyses"]

        now = datetime.now(timezone.utc)
        cycle_start = sub.current_period_start if sub else (now - timedelta(days=30))

        # Authoritative count from the immutable usage_events ledger
        count_stmt = (
            select(func.count(UsageEvent.id))
            .where(
                UsageEvent.workspace_id == workspace_id,
                UsageEvent.event_type == "analysis_package",
                UsageEvent.created_at >= cycle_start
            )
        )
        actual_used = (await db.scalar(count_stmt)) or 0

        # Reconcile cached counter if mismatched
        if sub and sub.cached_analyses_used != actual_used:
            sub.cached_analyses_used = actual_used
            await db.flush()

        remaining = max(0, monthly_limit - actual_used)
        is_allowed = actual_used < monthly_limit

        return QuotaCheckResult(
            allowed=is_allowed,
            used=actual_used,
            limit=monthly_limit,
            remaining=remaining,
            plan=plan
        )

    def can_use_feature(self, plan_tier: str, feature_key: str) -> bool:
        """Evaluates whether a boolean feature flag is unlocked on the plan."""
        limits = self.get_plan_limits(plan_tier)
        return bool(limits.get(feature_key, False))


entitlement_service = EntitlementService()
