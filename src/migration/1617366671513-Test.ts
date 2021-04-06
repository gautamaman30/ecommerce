import {MigrationInterface, QueryRunner} from "typeorm";

export class Test1617366671513 implements MigrationInterface {
    name = 'Test1617366671513'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "wallets" DROP COLUMN "wallet_transaction"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "wallets" ADD "wallet_transaction" integer NOT NULL DEFAULT '0'`);
    }

}
