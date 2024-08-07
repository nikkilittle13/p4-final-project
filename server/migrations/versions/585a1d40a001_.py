"""empty message

Revision ID: 585a1d40a001
Revises: 159233cf8933
Create Date: 2024-07-31 21:24:56.578448

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '585a1d40a001'
down_revision = '159233cf8933'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('appointments', schema=None) as batch_op:
        batch_op.alter_column('time',
               existing_type=sa.TIME(),
               type_=sa.Integer(),
               existing_nullable=True)

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('appointments', schema=None) as batch_op:
        batch_op.alter_column('time',
               existing_type=sa.Integer(),
               type_=sa.TIME(),
               existing_nullable=True)

    # ### end Alembic commands ###
