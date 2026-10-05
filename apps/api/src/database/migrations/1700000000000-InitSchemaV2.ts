import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitSchemaV21700000000000 implements MigrationInterface {
  name = 'InitSchemaV21700000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "postgis";`);
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "pgcrypto";`);
    await queryRunner.query(`CREATE SEQUENCE IF NOT EXISTS order_code_seq START 1;`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP SEQUENCE IF EXISTS order_code_seq;`);
  }
}
