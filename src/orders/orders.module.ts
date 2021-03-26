import { Module } from '@nestjs/common';
import { TypeOrmModule} from '@nestjs/typeorm';

import { Orders } from './entity';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { WalletsModule } from 'src/wallets/wallets.module';
import { PaymentsModule } from 'src/payments/payments.module';
import { ProductsModule } from 'src/products/products.module';
import { SellersModule } from 'src/sellers/sellers.module';

@Module({
  imports: [TypeOrmModule.forFeature([Orders]), WalletsModule, PaymentsModule, ProductsModule, SellersModule],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [TypeOrmModule]
})
export class OrdersModule {}


