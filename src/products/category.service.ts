import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryFailedError } from 'typeorm';

import { Category } from './entity';
import {CreateCategoryDto, DeleteCategoryDto, UpdateCategoryDto} from './dto';
import {Errors, Messages} from '../common/utils';

@Injectable()
export class CategoryService {
    constructor(@InjectRepository(Category) private categoryRepository: Repository<Category>) {}

    async findAllCategory() {
        try {
            const category = await this.categoryRepository.find();
            return category;
        } catch(err) {
            console.log(err.message);
            return new HttpException(Errors.INTERNAL_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async findCategoryByName(category_name: string) {
        try {
            const category = await this.categoryRepository.findOne(category_name);
            if(!category) {
                return new HttpException(Errors.CATEGORY_NOT_FOUND, HttpStatus.NOT_FOUND);
            }
            return category;
        } catch(err) {
            console.log(err.message);
            return new HttpException(Errors.INTERNAL_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async createCategory(createCategoryDto: CreateCategoryDto) {
        try {
            const result = await this.categoryRepository.insert(createCategoryDto);
            return {message: Messages.CATEGORY_CREATED_SUCCESSFULLY, createCategoryDto};
        } catch(err) {
            console.log(err.message);
            if(err instanceof QueryFailedError) {
                return new HttpException(Errors.CATEGORY_ALREADY_EXISTS, HttpStatus.BAD_REQUEST);
            }
            return new HttpException(Errors.INTERNAL_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async deleteCategory(deleteCategoryDto: DeleteCategoryDto) {
        try {
            const result = await this.categoryRepository.delete(deleteCategoryDto);
            if(result.affected === 0) {
                return new HttpException(Errors.CATEGORY_NOT_FOUND, HttpStatus.NOT_FOUND);
            }
            return {message: Messages.CATEGORY_DELETED_SUCCESSFULLY};
        } catch(err) {
            console.log(err.message);
            return new HttpException(Errors.INTERNAL_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async updateCategory(updateCategoryDto: UpdateCategoryDto) {
        try {
            let updateDoc: any = {};
            
            if(updateCategoryDto.description) updateDoc.description = updateCategoryDto.description; 

            if(Object.keys(updateDoc).length === 0) return new HttpException(Errors.CATEGORY_UPDATE_FIELDS_REQUIRED, HttpStatus.BAD_REQUEST);

            const result = await this.categoryRepository.update({category_name: updateCategoryDto.category_name}, updateDoc);
            if(result.affected === 0) {
                return new HttpException(Errors.CATEGORY_NOT_FOUND, HttpStatus.NOT_FOUND);
            }
            return {message: Messages.CATEGORY_UPDATED_SUCCESSFULLY, updateCategoryDto};
        } catch(err) {
            console.log(err.message);
            return new HttpException(Errors.INTERNAL_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
