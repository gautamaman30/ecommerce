import { Module } from '@nestjs/common';
import { ServiceController } from './service/service.controller';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

@Module({
  controllers: [ServiceController, ProductsController],
  providers: [ProductsService]
})
export class ProductsModule {}
