import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterTableCrop1749153358440 implements MigrationInterface {
    name = 'AlterTableCrop1749153358440'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "crops" DROP COLUMN "farm_id"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "crops" ADD "farm_id" character varying NOT NULL`);
    }

}
