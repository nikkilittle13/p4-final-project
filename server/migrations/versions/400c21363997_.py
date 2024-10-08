"""empty message

Revision ID: 400c21363997
Revises: 708f1e08b7cf
Create Date: 2024-08-13 20:01:22.140988

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '400c21363997'
down_revision = '708f1e08b7cf'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('clients', schema=None) as batch_op:
        batch_op.alter_column('phone_number',
               existing_type=sa.INTEGER(),
               type_=sa.String(),
               existing_nullable=True)

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('clients', schema=None) as batch_op:
        batch_op.alter_column('phone_number',
               existing_type=sa.String(),
               type_=sa.INTEGER(),
               existing_nullable=True)

    # ### end Alembic commands ###
