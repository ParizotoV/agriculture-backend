import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterTableFarm1749152281592 implements MigrationInterface {
  name = 'AlterTableFarm1749152281592';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "farms" DROP COLUMN "producer_id"`);
    await queryRunner.query(`ALTER TABLE "farms" DROP CONSTRAINT "FK_a47fa1b0ccf320f4028705ca3dd"`);
    await queryRunner.query(`ALTER TABLE "farms" ALTER COLUMN "producerId" DROP NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "farms" ADD CONSTRAINT "FK_a47fa1b0ccf320f4028705ca3dd" FOREIGN KEY ("producerId") REFERENCES "producers"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "farms" ADD "producer_id" character varying NOT NULL`);
    await queryRunner.query(`ALTER TABLE "farms" DROP CONSTRAINT "FK_a47fa1b0ccf320f4028705ca3dd"`);
    await queryRunner.query(`ALTER TABLE "farms" ALTER COLUMN "producerId" SET NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "farms" ADD CONSTRAINT "FK_a47fa1b0ccf320f4028705ca3dd" FOREIGN KEY ("producerId") REFERENCES "producers"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }
}
