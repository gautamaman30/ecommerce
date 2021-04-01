import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';

import { Users} from './users/entity';
import { Sellers} from './sellers/entity';
import { Wallets} from './wallets/entity';
import { Products, Category} from './products/entity';
import { Payments} from './payments/entity';
import { Orders} from './orders/entity'; 
import { UsersModule } from './users/users.module';
import { SellersModule} from './sellers/sellers.module'; 
import { WalletsModule } from './wallets/wallets.module';
import { PaymentsModule} from './payments/payments.module'; 
import { OrdersModule} from './orders/orders.module';
import { ProductsModule} from './products/products.module';
import { LoggerMiddleware, LowercaseReqKeysMiddleware} from './common/middleware';
import { configObj} from './common/configEnv';
import { JwtStrategy } from './common/strategy';
import { InvoicesModule } from './invoices/invoices.module';
import { Invoices } from './invoices/entity';

@Module({
    imports: [UsersModule, WalletsModule, PaymentsModule, 
        OrdersModule, ProductsModule, SellersModule, InvoicesModule,
        TypeOrmModule.forRootAsync({
            useFactory: () => ({
                type: <any>configObj.DB_TYPE,
                host: configObj.DB_HOST,
                port: configObj.DB_PORT,
                username: configObj.DB_USERNAME,
                password: configObj.DB_PASSWORD,
                database: configObj.DB_DATABASE,
                entities: [Users, Sellers, Wallets, Category, Products, Payments, Orders, Invoices],
                synchronize: true,
                logging: true  
            })
    })],
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
