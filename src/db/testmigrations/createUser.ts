import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateUser1589119433066 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
          },
          {
            name: 'email',
            type: 'varchar',
          },
          {
            name: 'password',
            type: 'varchar',
          },
          {
            name: 'first_name',
            type: 'varchar',
          },
          {
            name: 'last_name',
            type: 'varchar',
          },
          {
            name: 'is_active',
            type: 'integer',
          },
          {
            name: 'role',
            type: 'integer',
            default: 1,
          },
          {
            name: 'reset_token',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'reset_expiry_time',
            type: 'date',
            isNullable: true,
          },
          {
            name: 'otp',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
      true,
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('users');
  }
}
