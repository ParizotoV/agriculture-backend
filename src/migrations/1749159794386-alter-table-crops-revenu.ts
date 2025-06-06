import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterTableCropsRevenu1749159794386 implements MigrationInterface {
    name = 'AlterTableCropsRevenu1749159794386'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "crops" ADD "harvestQuantity" numeric(12,2)`);
        await queryRunner.query(`ALTER TABLE "crops" ADD "priceReceived" numeric(12,2)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "crops" DROP COLUMN "priceReceived"`);
        await queryRunner.query(`ALTER TABLE "crops" DROP COLUMN "harvestQuantity"`);
    }

}
