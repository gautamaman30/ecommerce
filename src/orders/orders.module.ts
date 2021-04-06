import { Module } from '@nestjs/common';
import { TypeOrmModule} from '@nestjs/typeorm';

import { Orders } from './entity';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { WalletsModule } from '../wallets/wallets.module';
import { PaymentsModule } from '../payments/payments.module';
import { ProductsModule } from '../products/products.module';
import { SellersModule } from '../sellers/sellers.module';
import { InvoicesModule } from '../invoices/invoices.module';
import { UsersModule } from '../users/users.module';

@Module({
    imports: [TypeOrmModule.forFeature([Orders]), 
        WalletsModule, 
        PaymentsModule, 
        ProductsModule, 
        SellersModule, 
        InvoicesModule,
        UsersModule
    ],
    controllers: [OrdersController],
    providers: [OrdersService],
    exports: [TypeOrmModule]
})
export class OrdersModule {}


