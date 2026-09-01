"""Add waitlist_entries table

Revision ID: 0003
Revises: 0002
Create Date: 2026-09-01 00:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '0003'
down_revision: Union[str, None] = '0002'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table('waitlist_entries',
    sa.Column('id', sa.String(length=50), nullable=False),
    sa.Column('email', sa.String(length=255), nullable=False),
    sa.Column('name', sa.String(length=255), nullable=True),
    sa.Column('source', sa.String(length=255), nullable=True),
    sa.Column('status', sa.String(length=50), nullable=False, server_default='pending'),
    sa.Column('youtube_channel', sa.String(length=255), nullable=True),
    sa.Column('niche', sa.String(length=100), nullable=True),
    sa.Column('country', sa.String(length=100), nullable=True),
    sa.Column('subscriber_count', sa.String(length=50), nullable=True),
    sa.Column('reason', sa.Text(), nullable=True),
    sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_waitlist_entries_email'), 'waitlist_entries', ['email'], unique=True)
    op.create_index(op.f('ix_waitlist_entries_id'), 'waitlist_entries', ['id'], unique=False)

def downgrade() -> None:
    op.drop_index(op.f('ix_waitlist_entries_id'), table_name='waitlist_entries')
    op.drop_index(op.f('ix_waitlist_entries_email'), table_name='waitlist_entries')
    op.drop_table('waitlist_entries')
