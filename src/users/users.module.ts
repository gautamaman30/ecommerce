import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { AuthController } from './auth.controller';
import { SellersController } from './sellers.controller';
import { UsersService } from './users.service';
import { SellersService } from './sellers.service';

@Module({
    controllers: [UsersController, AuthController, SellersController],
    providers: [UsersService, SellersService],
    exports: [UsersService, SellersService]
})
export class UsersModule {}
