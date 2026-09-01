"""Idea intelligence tables

Revision ID: 0004
Revises: 0003
Create Date: 2026-09-01 16:10:00.000000

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = '0004'
down_revision = '0003'
branch_labels = None
depends_on = None

def upgrade() -> None:
    op.create_table('ideas',
        sa.Column('id', sa.String(), nullable=False),
        sa.Column('workspace_id', sa.String(), nullable=False),
        sa.Column('user_id', sa.String(), nullable=False),
        sa.Column('topic_slug', sa.String(), nullable=False),
        sa.Column('canonical_name', sa.String(), nullable=False),
        sa.Column('angle', sa.String(), nullable=False),
        sa.Column('title_concept', sa.String(), nullable=False),
        sa.Column('format', sa.String(), nullable=False),
        sa.Column('audience', sa.String(), nullable=False),
        sa.Column('hook', sa.Text(), nullable=False),
        sa.Column('why_now', sa.Text(), nullable=False),
        sa.Column('evidence', sa.Text(), nullable=False),
        sa.Column('difficulty', sa.String(), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=True),
        sa.PrimaryKeyConstraint('id', name=op.f('pk_ideas'))
    )
    op.create_index(op.f('ix_ideas_workspace_id'), 'ideas', ['workspace_id'], unique=False)
    op.create_index(op.f('ix_ideas_user_id'), 'ideas', ['user_id'], unique=False)

def downgrade() -> None:
    op.drop_index(op.f('ix_ideas_user_id'), table_name='ideas')
    op.drop_index(op.f('ix_ideas_workspace_id'), table_name='ideas')
    op.drop_table('ideas')
