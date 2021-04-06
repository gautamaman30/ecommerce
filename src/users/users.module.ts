import { Module } from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';

import { Users} from './entity';
import { UsersController } from './users.controller';
import { AuthController } from './auth.controller';
import { UsersService } from './users.service';
import { WalletsModule } from '../wallets/wallets.module';

@Module({
    imports: [TypeOrmModule.forFeature([Users]), WalletsModule],
    controllers: [UsersController, AuthController],
    providers: [UsersService],
    exports: [UsersService, TypeOrmModule],
})
export class UsersModule {}

