import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import {Wallets} from './entity';
import { WalletsController } from './wallets.controller';
import { WalletsService } from './wallets.service';

@Module({
  imports: [TypeOrmModule.forFeature([Wallets])],
  controllers: [WalletsController],
  providers: [WalletsService],
  exports: [TypeOrmModule] 
})
export class WalletsModule {}
