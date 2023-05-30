import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1685445144269 implements MigrationInterface {
    name = 'Init1685445144269'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "permission" ("id" SERIAL NOT NULL, "path" character varying NOT NULL, "method" character varying NOT NULL, CONSTRAINT "PK_3b8b97af9d9d8807e41e6f48362" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "role" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "identity" ("id" SERIAL NOT NULL, "deletedAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "username" character varying NOT NULL, "type" character varying NOT NULL DEFAULT 'User', "emailVerified" boolean NOT NULL DEFAULT false, "password" character varying, "active" boolean NOT NULL DEFAULT true, "roleId" integer, CONSTRAINT "PK_ff16a44186b286d5e626178f726" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."user_gender_enum" AS ENUM('man', 'woman', 'other')`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deleteAt" TIMESTAMP, "firstName" character varying(80) NOT NULL, "lastName" character varying(80) NOT NULL, "email" character varying NOT NULL, "birthDate" TIMESTAMP, "gender" "public"."user_gender_enum", "bio" character varying(800), "location" character varying(100), "phoneNumber" character varying, "IdentityId" integer, CONSTRAINT "REL_23f7738f5b8a5cdf52f524a5db" UNIQUE ("IdentityId"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "product" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deleteAt" TIMESTAMP, "title" character varying NOT NULL, "abi" json, "publicKey" uuid NOT NULL, "privateKey" character varying, "isActive" boolean NOT NULL, "state" json, "ownerId" integer, CONSTRAINT "PK_bebc9158e480b949565b4dc7a82" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "activity_log" ("id" SERIAL NOT NULL, "responseTime" integer NOT NULL, "sentAt" TIMESTAMP NOT NULL DEFAULT now(), "user" json, "request" json, "response" json, "entity" json, "action" json, CONSTRAINT "PK_067d761e2956b77b14e534fd6f1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "setting" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deleteAt" TIMESTAMP, "name" character varying NOT NULL, "value" json NOT NULL, CONSTRAINT "PK_fcb21187dc6094e24a48f677bed" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "permission_roles_role" ("permissionId" integer NOT NULL, "roleId" integer NOT NULL, CONSTRAINT "PK_534958b0063b8ad39335d7bcfd0" PRIMARY KEY ("permissionId", "roleId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_9f44b6228b173c7b9dfb8c6600" ON "permission_roles_role" ("permissionId") `);
        await queryRunner.query(`CREATE INDEX "IDX_7ec93d4fbf75b063f3ffd2646a" ON "permission_roles_role" ("roleId") `);
        await queryRunner.query(`ALTER TABLE "identity" ADD CONSTRAINT "FK_f57409101ad621ce6e950a5e12a" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_23f7738f5b8a5cdf52f524a5db6" FOREIGN KEY ("IdentityId") REFERENCES "identity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product" ADD CONSTRAINT "FK_cbb5d890de1519efa20c42bcd52" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "permission_roles_role" ADD CONSTRAINT "FK_9f44b6228b173c7b9dfb8c66003" FOREIGN KEY ("permissionId") REFERENCES "permission"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "permission_roles_role" ADD CONSTRAINT "FK_7ec93d4fbf75b063f3ffd2646a5" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "permission_roles_role" DROP CONSTRAINT "FK_7ec93d4fbf75b063f3ffd2646a5"`);
        await queryRunner.query(`ALTER TABLE "permission_roles_role" DROP CONSTRAINT "FK_9f44b6228b173c7b9dfb8c66003"`);
        await queryRunner.query(`ALTER TABLE "product" DROP CONSTRAINT "FK_cbb5d890de1519efa20c42bcd52"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_23f7738f5b8a5cdf52f524a5db6"`);
        await queryRunner.query(`ALTER TABLE "identity" DROP CONSTRAINT "FK_f57409101ad621ce6e950a5e12a"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_7ec93d4fbf75b063f3ffd2646a"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_9f44b6228b173c7b9dfb8c6600"`);
        await queryRunner.query(`DROP TABLE "permission_roles_role"`);
        await queryRunner.query(`DROP TABLE "setting"`);
        await queryRunner.query(`DROP TABLE "activity_log"`);
        await queryRunner.query(`DROP TABLE "product"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TYPE "public"."user_gender_enum"`);
        await queryRunner.query(`DROP TABLE "identity"`);
        await queryRunner.query(`DROP TABLE "role"`);
        await queryRunner.query(`DROP TABLE "permission"`);
    }

}
