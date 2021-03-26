import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Connection } from 'typeorm';

import { Products, Category } from './entity';
import {CreateProductsDto, DeleteProductsDto, UpdateProductsDto} from './dto';
import {Errors, Messages, helperFunctions} from '../common/utils';

@Injectable()
export class ProductsService {
    constructor(@InjectRepository(Products) private productsRepository: Repository<Products>, 
        private connection: Connection) {}

    async findAllProducts() {
        try {
            const products = await this.productsRepository.find();
            return products;
        } catch(err) {
            console.log(err.message);
            return new HttpException(Errors.INTERNAL_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async findProductsById(product_id: string) {
        try {
            const product = await this.productsRepository.findOne(product_id);
            if(!product) {
                return new HttpException(Errors.PRODUCT_NOT_FOUND, HttpStatus.NOT_FOUND);
            }
            return product;
        } catch(err) {
            console.log(err.message);
            return new HttpException(Errors.INTERNAL_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async findProductsByCategory(product_category) {
        try {
            const products = await this.productsRepository.find(product_category);
            if(products.length === 0) {
                return new HttpException(Errors.PRODUCT_NOT_FOUND_CATEGORY, HttpStatus.NOT_FOUND);
            }
            return products;
        } catch(err) {
            console.log(err.message);
            return new HttpException(Errors.INTERNAL_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async findProductsBySellers(sellers_id) {
        try {
            const products = await this.productsRepository.find(sellers_id);
            if(products.length === 0) {
                return new HttpException(Errors.PRODUCT_NOT_FOUND_SELLERS_ID, HttpStatus.NOT_FOUND);
            }
            return products;
        } catch(err) {
            console.log(err.message);
            return new HttpException(Errors.INTERNAL_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async createProducts(createProductsDto: CreateProductsDto) {
        try {
            createProductsDto.product_id = helperFunctions.generateRandomIdNumbers();

            const result = await this.connection.transaction(async manager => {
                const category = await manager.findOne(Category, {category_name: createProductsDto.product_category});
                if(category) {
                    return manager.insert(Products, createProductsDto);
                }
                return new HttpException(Errors.CATEGORY_NOT_FOUND, HttpStatus.NOT_FOUND);
            });

            if(result instanceof HttpException) {
                return result;
            }
            return {message: Messages.PRODUCT_CREATED_SUCCESSFULLY, createProductsDto};
        } catch(err) {
            console.log(err.message);
            return new HttpException(Errors.INTERNAL_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async deleteProducts(deleteProductsDto: DeleteProductsDto) {
        try {
            const result = await this.productsRepository.delete(deleteProductsDto);
            if(result.affected === 0) {
                return new HttpException(Errors.PRODUCT_NOT_FOUND, HttpStatus.NOT_FOUND);
            }
            return {message: Messages.PRODUCT_DELETED_SUCCESSFULLY};
        } catch(err) {
            console.log(err.message);
            return new HttpException(Errors.INTERNAL_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async updateProducts(updateProductsDto: UpdateProductsDto) {
        try {
            let filter: any = {};
            filter.product_id = updateProductsDto.product_id;
            filter.sellers_id = updateProductsDto.sellers_id;
            
            let updateDoc: any = {};
            
            if(updateProductsDto.name) updateDoc.name = updateProductsDto.name; 
            if(updateProductsDto.description) updateDoc.description = updateProductsDto.description; 
            if(updateProductsDto.brand_name) updateDoc.brand_name = updateProductsDto.brand_name; 
            if(updateProductsDto.color) updateDoc.color = updateProductsDto.color; 
            if(updateProductsDto.price) updateDoc.price = updateProductsDto.price;
            if(updateProductsDto.quantity) updateDoc.quantity = updateProductsDto.quantity; 

            if(Object.keys(updateDoc).length === 0) return new HttpException(Errors.PRODUCT_UPDATE_FIELDS_REQUIRED, HttpStatus.BAD_REQUEST);

            const result = await this.productsRepository.update(filter, updateDoc);
            if(result.affected === 0) {
                return new HttpException(Errors.PRODUCT_NOT_FOUND, HttpStatus.NOT_FOUND);
            }
            return {message: Messages.PRODUCT_UPDATED_SUCCESSFULLY, updateProductsDto};
        } catch(err) {
            console.log(err.message);
            return new HttpException(Errors.INTERNAL_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
