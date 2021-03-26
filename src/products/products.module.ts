import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import {Products, Category} from './entity';
import { ProductsController } from './products.controller';
import { CategoryController } from './category.controller';
import { ProductsService } from './products.service';
import { CategoryService } from './category.service';

@Module({
  imports: [TypeOrmModule.forFeature([Products, Category])],
  controllers: [ProductsController, CategoryController],
  providers: [ProductsService, CategoryService]
})
export class ProductsModule {}
