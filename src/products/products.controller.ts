import { Controller, UsePipes, UseGuards, Get, Post, Put, Delete, Req, Body, Query, Param } from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport';

import {Role} from '../common/enums';
import {Roles} from '../common/customDecorators';
import {RolesGuard} from '../common/guards';
import {ProductsService} from './products.service';
import {CreateProductsDto, DeleteProductsDto, UpdateProductsDto} from './dto';
import {getProductsByCategorySchema, getProductsByIdSchema, getProductsBySellersIdSchema,
    createProductsSchema, deleteProductsSchema, updateProductsSchema} from './validationSchema';
import { ReqValidationPipe } from '../common/pipe';

@Controller('products')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class ProductsController { 
    constructor(private productsService: ProductsService) {}
    
    @Get()
    @Roles(Role.Admin, Role.Buyers, Role.Sellers)
    findAllProducts() {
        return this.productsService.findAllProducts();
    }

    @Get(':product_id')
    @Roles(Role.Admin, Role.Buyers, Role.Sellers)
    @UsePipes(new ReqValidationPipe(getProductsByIdSchema))
    findProductsById(@Param() product_id: string) {
        return this.productsService.findProductsById(product_id);
    }

    @Get(':product_category')
    @Roles(Role.Admin, Role.Buyers, Role.Sellers)
    @UsePipes(new ReqValidationPipe(getProductsByCategorySchema))
    findProductsByCategory(@Param() product_category: string) {
        return this.productsService.findProductsByCategory(product_category);
    }

    @Get('sellers')
    @Roles(Role.Sellers)
    findProductsBySellers(@Req() req) {
        return this.productsService.findProductsBySellers(req.user.seller_id);
    }

    @Get('sellers/:sellers_id')
    @Roles(Role.Admin, Role.Buyers, Role.Sellers)
    @UsePipes(new ReqValidationPipe(getProductsBySellersIdSchema))
    findProductsBySellersId(@Param() sellers_id: string) {
        return this.productsService.findProductsBySellers(sellers_id);
    }

    @Post()
    @Roles(Role.Sellers)
    @UsePipes(new ReqValidationPipe(createProductsSchema))
    createProducts(@Body() createProductsDto: CreateProductsDto, @Req() req) {
        createProductsDto.sellers_id = req.user.sellers_id;
        return this.productsService.createProducts(createProductsDto);
    }

    @Delete()
    @Roles(Role.Admin)
    @UsePipes(new ReqValidationPipe(deleteProductsSchema))
    deleteProducts(@Body() deleteProductsDto: DeleteProductsDto) {
        return this.productsService.deleteProducts(deleteProductsDto);
    }

    @Delete(':product_id')
    @Roles(Role.Sellers)
    @UsePipes(new ReqValidationPipe(deleteProductsSchema))
    deleteProductsById(@Param() deleteProductsDto = new DeleteProductsDto, @Req() req) {
        deleteProductsDto.sellers_id = req.user.sellers_id;
        return this.productsService.deleteProducts(deleteProductsDto);
    }

    @Put()
    @Roles(Role.Sellers)
    @UsePipes(new ReqValidationPipe(updateProductsSchema))
    updateProducts(@Body() updateProductsDto: UpdateProductsDto, @Req() req) {
        updateProductsDto.sellers_id = req.user.sellers_id;
        return this.productsService.updateProducts(updateProductsDto);
    }
}
