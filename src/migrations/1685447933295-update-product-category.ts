import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateProductCategory1685447933295 implements MigrationInterface {
    name = 'UpdateProductCategory1685447933295'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" DROP CONSTRAINT "FK_cbb5d890de1519efa20c42bcd52"`);
        await queryRunner.query(`CREATE TABLE "category" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deleteAt" TIMESTAMP, "title" character varying(30) NOT NULL, "isActive" boolean NOT NULL, "parentId" integer, CONSTRAINT "PK_9c4e4a89e3674fc9f382d733f03" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "title"`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "abi"`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "publicKey"`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "privateKey"`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "isActive"`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "state"`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "ownerId"`);
        await queryRunner.query(`ALTER TABLE "product" ADD "name" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "product" ADD "description" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "product" ADD "price" numeric(15,2) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "product" ADD "tags" json`);
        await queryRunner.query(`ALTER TABLE "product" ADD "artisanId" integer`);
        await queryRunner.query(`ALTER TABLE "product" ADD "categoryId" integer`);
        await queryRunner.query(`ALTER TABLE "category" ADD CONSTRAINT "FK_d5456fd7e4c4866fec8ada1fa10" FOREIGN KEY ("parentId") REFERENCES "category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product" ADD CONSTRAINT "FK_e005ab137a3f627098eb1e81923" FOREIGN KEY ("artisanId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product" ADD CONSTRAINT "FK_ff0c0301a95e517153df97f6812" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" DROP CONSTRAINT "FK_ff0c0301a95e517153df97f6812"`);
        await queryRunner.query(`ALTER TABLE "product" DROP CONSTRAINT "FK_e005ab137a3f627098eb1e81923"`);
        await queryRunner.query(`ALTER TABLE "category" DROP CONSTRAINT "FK_d5456fd7e4c4866fec8ada1fa10"`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "categoryId"`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "artisanId"`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "tags"`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "price"`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "description"`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "product" ADD "ownerId" integer`);
        await queryRunner.query(`ALTER TABLE "product" ADD "state" json`);
        await queryRunner.query(`ALTER TABLE "product" ADD "isActive" boolean NOT NULL`);
        await queryRunner.query(`ALTER TABLE "product" ADD "privateKey" character varying`);
        await queryRunner.query(`ALTER TABLE "product" ADD "publicKey" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "product" ADD "abi" json`);
        await queryRunner.query(`ALTER TABLE "product" ADD "title" character varying NOT NULL`);
        await queryRunner.query(`DROP TABLE "category"`);
        await queryRunner.query(`ALTER TABLE "product" ADD CONSTRAINT "FK_cbb5d890de1519efa20c42bcd52" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
