"""initial_saas_core_schema

Revision ID: 0001_saas_core
Revises: 
Create Date: 2026-08-29 22:25:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '0001_saas_core'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # 1. users table
    op.create_table(
        'users',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('email', sa.String(255), nullable=False),
        sa.Column('hashed_password', sa.String(255), nullable=False),
        sa.Column('full_name', sa.String(255), nullable=False),
        sa.Column('is_active', sa.Boolean(), nullable=False, server_default='true'),
        sa.Column('is_verified', sa.Boolean(), nullable=False, server_default='false'),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index('ix_users_email', 'users', ['email'], unique=True)

    # 2. sessions table
    op.create_table(
        'sessions',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('users.id', ondelete='CASCADE'), nullable=False),
        sa.Column('token_hash', sa.String(64), nullable=False),
        sa.Column('expires_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('revoked_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('ip_address', sa.String(45), nullable=True),
        sa.Column('user_agent', sa.String(500), nullable=True),
        sa.Column('last_active_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index('ix_sessions_token_hash', 'sessions', ['token_hash'], unique=True)
    op.create_index('ix_sessions_user_id', 'sessions', ['user_id'])
    op.create_index('ix_sessions_expires_at', 'sessions', ['expires_at'])

    # 3. password_reset_tokens table
    op.create_table(
        'password_reset_tokens',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('users.id', ondelete='CASCADE'), nullable=False),
        sa.Column('token_hash', sa.String(64), nullable=False),
        sa.Column('expires_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('used_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index('ix_password_reset_tokens_token_hash', 'password_reset_tokens', ['token_hash'], unique=True)
    op.create_index('ix_password_reset_tokens_user_id', 'password_reset_tokens', ['user_id'])

    # 4. workspaces table
    op.create_table(
        'workspaces',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('name', sa.String(255), nullable=False),
        sa.Column('slug', sa.String(255), nullable=False),
        sa.Column('owner_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('users.id', ondelete='RESTRICT'), nullable=False),
        sa.Column('plan_tier', sa.String(50), nullable=False, server_default='free'),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index('ix_workspaces_slug', 'workspaces', ['slug'], unique=True)

    # 5. workspace_members table
    op.create_table(
        'workspace_members',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('workspace_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('workspaces.id', ondelete='CASCADE'), nullable=False),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('users.id', ondelete='CASCADE'), nullable=False),
        sa.Column('role', sa.String(50), nullable=False, server_default='member'),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.UniqueConstraint('workspace_id', 'user_id', name='uq_workspace_member_user')
    )
    op.create_index('ix_workspace_members_workspace_id', 'workspace_members', ['workspace_id'])
    op.create_index('ix_workspace_members_user_id', 'workspace_members', ['user_id'])

    # 6. projects table
    op.create_table(
        'projects',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('workspace_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('workspaces.id', ondelete='CASCADE'), nullable=False),
        sa.Column('name', sa.String(255), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('channel_id', sa.String(255), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index('ix_projects_workspace_id', 'projects', ['workspace_id'])

    # 7. analyses table
    op.create_table(
        'analyses',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('workspace_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('workspaces.id', ondelete='CASCADE'), nullable=False),
        sa.Column('project_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('projects.id', ondelete='SET NULL'), nullable=True),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('users.id', ondelete='SET NULL'), nullable=True),
        sa.Column('title', sa.String(500), nullable=False),
        sa.Column('thumbnail_storage_key', sa.String(500), nullable=True),
        sa.Column('niche', sa.String(100), nullable=False, server_default='General'),
        sa.Column('region', sa.String(10), nullable=False, server_default='IN'),
        sa.Column('score', sa.Float(), nullable=False, server_default='0.0'),
        sa.Column('tier', sa.String(10), nullable=False, server_default='C'),
        sa.Column('confidence', sa.String(20), nullable=False, server_default='MEDIUM'),
        sa.Column('status', sa.String(30), nullable=False, server_default='completed'),
        sa.Column('factors', postgresql.JSONB(astext_type=sa.Text()), nullable=False, server_default='{}'),
        sa.Column('master_report', postgresql.JSONB(astext_type=sa.Text()), nullable=False, server_default='{}'),
        sa.Column('topic_intelligence', postgresql.JSONB(astext_type=sa.Text()), nullable=True),
        sa.Column('raw_metrics', postgresql.JSONB(astext_type=sa.Text()), nullable=False, server_default='{}'),
        sa.Column('idempotency_key', sa.String(128), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('completed_at', sa.DateTime(timezone=True), nullable=True),
    )
    op.create_index('ix_analyses_workspace_id', 'analyses', ['workspace_id'])
    op.create_index('ix_analyses_project_id', 'analyses', ['project_id'])
    op.create_index('ix_analyses_created_at', 'analyses', ['created_at'])
    op.create_index('ix_analyses_idempotency_key', 'analyses', ['idempotency_key'])

    # 8. usage_events table (Authoritative Ledger)
    op.create_table(
        'usage_events',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('workspace_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('workspaces.id', ondelete='CASCADE'), nullable=False),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('users.id', ondelete='SET NULL'), nullable=True),
        sa.Column('analysis_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('analyses.id', ondelete='SET NULL'), nullable=True),
        sa.Column('event_type', sa.String(50), nullable=False),
        sa.Column('pricing_version', sa.String(50), nullable=False),
        sa.Column('gemini_input_tokens', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('gemini_output_tokens', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('gemini_cost_usd', sa.Float(), nullable=False, server_default='0.0'),
        sa.Column('dataforseo_cost_usd', sa.Float(), nullable=False, server_default='0.0'),
        sa.Column('compute_ms', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('total_cost_usd', sa.Float(), nullable=False, server_default='0.0'),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index('ix_usage_events_workspace_id', 'usage_events', ['workspace_id'])
    op.create_index('ix_usage_events_created_at', 'usage_events', ['created_at'])

    # 9. subscriptions table
    op.create_table(
        'subscriptions',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('workspace_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('workspaces.id', ondelete='CASCADE'), nullable=False),
        sa.Column('stripe_customer_id', sa.String(255), nullable=True),
        sa.Column('stripe_subscription_id', sa.String(255), nullable=True),
        sa.Column('plan', sa.String(50), nullable=False, server_default='free'),
        sa.Column('status', sa.String(50), nullable=False, server_default='active'),
        sa.Column('current_period_start', sa.DateTime(timezone=True), nullable=False),
        sa.Column('current_period_end', sa.DateTime(timezone=True), nullable=False),
        sa.Column('cached_analyses_used', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index('ix_subscriptions_workspace_id', 'subscriptions', ['workspace_id'], unique=True)


def downgrade() -> None:
    op.drop_table('subscriptions')
    op.drop_table('usage_events')
    op.drop_table('analyses')
    op.drop_table('projects')
    op.drop_table('workspace_members')
    op.drop_table('workspaces')
    op.drop_table('password_reset_tokens')
    op.drop_table('sessions')
    op.drop_table('users')
