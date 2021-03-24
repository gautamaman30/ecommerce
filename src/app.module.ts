import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {Users, Sellers} from './users/entity';
import {Wallets} from './wallets/entity';
import {Products, Category} from './products/entity';
import { UsersModule } from './users/users.module';
import { WalletsModule } from './wallets/wallets.module';
import {LoggerMiddleware, LowercaseReqKeysMiddleware} from './common/middleware';
import {configObj} from './common/configEnv';
import { JwtStrategy } from './common/strategy';

@Module({
    imports: [UsersModule, WalletsModule, TypeOrmModule.forRootAsync({
        useFactory: () => ({
            type: <any>configObj.DB_TYPE,
            host: configObj.DB_HOST,
            port: configObj.DB_PORT,
            username: configObj.DB_USERNAME,
            password: configObj.DB_PASSWORD,
            database: configObj.DB_DATABASE,
            entities: [Users, Sellers, Wallets, Category, Products],
//            synchronize: true,
            logging: true  
        })
    })],
    controllers: [],
    providers: [JwtStrategy],
})
export class AppModule implements NestModule{
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(LowercaseReqKeysMiddleware)
            .forRoutes({ path: 'user', method: RequestMethod.ALL});
        consumer.apply(LoggerMiddleware)
            .forRoutes({path: 'user', method: RequestMethod.ALL});        
    }
}
