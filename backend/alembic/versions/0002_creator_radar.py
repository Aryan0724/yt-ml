"""creator_radar_schema

Revision ID: 0002_creator_radar
Revises: 0001_saas_core
Create Date: 2026-08-29 23:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '0002_creator_radar'
down_revision: Union[str, None] = '0001_saas_core'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # 1. topics table
    op.create_table(
        'topics',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('slug', sa.String(255), nullable=False),
        sa.Column('canonical_name', sa.String(255), nullable=False),
        sa.Column('category', sa.String(100), nullable=False, server_default='General'),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index('ix_topics_slug', 'topics', ['slug'], unique=True)
    op.create_index('ix_topics_category', 'topics', ['category'], unique=False)

    # 2. topic_snapshots table
    op.create_table(
        'topic_snapshots',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('topic_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('topics.id', ondelete='CASCADE'), nullable=False),
        sa.Column('region', sa.String(10), nullable=False, server_default='IN'),
        sa.Column('time_range', sa.String(20), nullable=False, server_default='12m'),
        sa.Column('current_value', sa.Integer(), nullable=False),
        sa.Column('baseline_value', sa.Float(), nullable=False),
        sa.Column('growth_rate', sa.Float(), nullable=False, server_default='0.0'),
        sa.Column('short_term_momentum', sa.Float(), nullable=False, server_default='0.0'),
        sa.Column('long_term_momentum', sa.Float(), nullable=False, server_default='0.0'),
        sa.Column('volatility', sa.Float(), nullable=False, server_default='0.0'),
        sa.Column('freshness', sa.Float(), nullable=False, server_default='50.0'),
        sa.Column('saturation', sa.Float(), nullable=False, server_default='50.0'),
        sa.Column('confidence', sa.String(20), nullable=False, server_default='HIGH'),
        sa.Column('opportunity_score', sa.Float(), nullable=False, server_default='50.0'),
        sa.Column('opportunity_tier', sa.String(20), nullable=False, server_default='MODERATE'),
        sa.Column('classification', sa.String(30), nullable=False, server_default='STABLE'),
        sa.Column('model_version', sa.String(20), nullable=False, server_default='2026-v1'),
        sa.Column('why_this_matters', sa.String(1000), nullable=True),
        sa.Column('creator_opportunity', sa.String(1000), nullable=True),
        sa.Column('time_series', postgresql.JSONB(astext_type=sa.Text()), nullable=False),
        sa.Column('evidence', postgresql.JSONB(astext_type=sa.Text()), nullable=False),
        sa.Column('data_source', sa.String(50), nullable=False, server_default='dataforseo_google_trends'),
        sa.Column('captured_at', sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index('ix_topic_snapshots_topic_id', 'topic_snapshots', ['topic_id'], unique=False)
    op.create_index('ix_topic_snapshots_region', 'topic_snapshots', ['region'], unique=False)
    op.create_index('ix_topic_snapshots_opportunity', 'topic_snapshots', ['opportunity_score'], unique=False)
    op.create_index('ix_topic_snapshots_classification', 'topic_snapshots', ['classification'], unique=False)
    op.create_index('ix_topic_snapshots_captured_at', 'topic_snapshots', ['captured_at'], unique=False)
    op.create_index('ix_topic_snapshots_region_classification', 'topic_snapshots', ['region', 'classification'], unique=False)
    op.create_index('ix_topic_snapshots_region_opportunity', 'topic_snapshots', ['region', 'opportunity_score'], unique=False)


def downgrade() -> None:
    op.drop_table('topic_snapshots')
    op.drop_table('topics')
