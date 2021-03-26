import { Module } from '@nestjs/common';
import { TypeOrmModule} from '@nestjs/typeorm';

import { Sellers} from './entity';
import { SellersController} from './sellers.controller';
import { SellersService} from './sellers.service';
import { WalletsModule } from '../wallets/wallets.module';
import { UsersModule } from '../users/users.module';

@Module({
    imports: [TypeOrmModule.forFeature([Sellers]), UsersModule, WalletsModule],
    controllers: [SellersController],
    providers: [SellersService],
    exports: [TypeOrmModule]
})
export class SellersModule {
}

