import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersModule } from './users/users.module';
import { SellersModule} from './sellers/sellers.module'; 
import { WalletsModule } from './wallets/wallets.module';
import { PaymentsModule} from './payments/payments.module'; 
import { OrdersModule} from './orders/orders.module';
import { ProductsModule} from './products/products.module';
import { LoggerMiddleware, LowercaseReqKeysMiddleware} from './common/middleware';
import { JwtStrategy } from './common/strategy';
import { InvoicesModule } from './invoices/invoices.module';

@Module({
    imports: [TypeOrmModule.forRoot(), UsersModule, WalletsModule, PaymentsModule, 
        OrdersModule, ProductsModule, SellersModule, InvoicesModule],
    controllers: [],
    providers: [JwtStrategy],
})
export class AppModule implements NestModule{
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(LowercaseReqKeysMiddleware)
            .forRoutes({ path: 'users', method: RequestMethod.ALL}, 
                { path: 'sellers', method: RequestMethod.ALL},
                { path: 'products', method: RequestMethod.ALL},
                { path: 'wallets', method: RequestMethod.ALL},
                { path: 'payments', method: RequestMethod.ALL},
                { path: 'orders', method: RequestMethod.ALL},
                { path: 'invoices', method: RequestMethod.ALL});
        consumer.apply(LoggerMiddleware)
            .forRoutes({ path: 'users', method: RequestMethod.ALL}, 
            { path: 'sellers', method: RequestMethod.ALL},
            { path: 'products', method: RequestMethod.ALL},
            { path: 'wallets', method: RequestMethod.ALL},
            { path: 'payments', method: RequestMethod.ALL},
            { path: 'orders', method: RequestMethod.ALL},
            { path: 'invoices', method: RequestMethod.ALL});
    }
}
