import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1749087493249 implements MigrationInterface {
    name = 'InitialSchema1749087493249'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "producers" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "cpf_cnpj" character varying NOT NULL, CONSTRAINT "UQ_69c9e8a2abe4f39ee6d64d8977e" UNIQUE ("cpf_cnpj"), CONSTRAINT "PK_7f16886d1a44ed0974232b82506" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "farms" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "city" character varying NOT NULL, "state" character varying NOT NULL, "total_area" numeric NOT NULL, "agricultural_area" numeric NOT NULL, "vegetation_area" numeric NOT NULL, "producer_id" character varying NOT NULL, "producerId" uuid, CONSTRAINT "CHK_894fbf3c3b7ee72572945a951b" CHECK ("agricultural_area" + "vegetation_area" <= "total_area"), CONSTRAINT "PK_39aff9c35006b14025bba5a43d9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "crops" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "season" character varying(50) NOT NULL, "culture_name" character varying(50) NOT NULL, "farm_id" character varying NOT NULL, "farmId" uuid, CONSTRAINT "PK_098dbeb7c803dc7c08a7f02b805" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "farms" ADD CONSTRAINT "FK_a47fa1b0ccf320f4028705ca3dd" FOREIGN KEY ("producerId") REFERENCES "producers"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "crops" ADD CONSTRAINT "FK_22c38f5ca32439c43bf2a9142a2" FOREIGN KEY ("farmId") REFERENCES "farms"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "crops" DROP CONSTRAINT "FK_22c38f5ca32439c43bf2a9142a2"`);
        await queryRunner.query(`ALTER TABLE "farms" DROP CONSTRAINT "FK_a47fa1b0ccf320f4028705ca3dd"`);
        await queryRunner.query(`DROP TABLE "crops"`);
        await queryRunner.query(`DROP TABLE "farms"`);
        await queryRunner.query(`DROP TABLE "producers"`);
    }

}
