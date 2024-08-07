"""added models

Revision ID: 23568c9275f3
Revises: 9b934d9ab053
Create Date: 2024-07-31 20:54:21.885312

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '23568c9275f3'
down_revision = '9b934d9ab053'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('appointments',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('clients',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('services',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('stylists',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('stylists')
    op.drop_table('services')
    op.drop_table('clients')
    op.drop_table('appointments')
    # ### end Alembic commands ###
