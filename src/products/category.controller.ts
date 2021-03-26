import { Controller, UsePipes, UseGuards, Get, Post, Put, Delete, Req, Body, Query, Param } from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport';

import { Role} from '../common/enums';
import { Roles} from '../common/customDecorators';
import { RolesGuard} from '../common/guards';
import { CategoryService} from './category.service';
import { CreateCategoryDto, DeleteCategoryDto, UpdateCategoryDto} from './dto';
import { getCategorySchema, postCategorySchema, deleteCategorySchema, updateCategorySchema} from './validationSchema'; 
import { ReqValidationPipe } from 'src/common/pipe';

@Controller('category')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class CategoryController { 
    constructor(private categoryService: CategoryService) {}
    
    @Get()
    @Roles(Role.Admin, Role.Buyers, Role.Sellers)
    findAllCategory() {
        return this.categoryService.findAllCategory();
    }

    @Get(':name')
    @Roles(Role.Admin, Role.Buyers, Role.Sellers)
    @UsePipes(new ReqValidationPipe(getCategorySchema))
    findCategoryByName(@Param() name: string) {
        return this.categoryService.findCategoryByName(name);
    }

    @Post()
    @Roles(Role.Admin)
    @UsePipes(new ReqValidationPipe(postCategorySchema))
    createCategory(@Body() createCategoryDto: CreateCategoryDto) {
        return this.categoryService.createCategory(createCategoryDto);
    }

    @Delete()
    @Roles(Role.Admin)
    @UsePipes(new ReqValidationPipe(deleteCategorySchema))
    deleteCategory(@Body() deleteCategoryDto: DeleteCategoryDto) {
        return this.categoryService.deleteCategory(deleteCategoryDto);
    }

    @Put()
    @Roles(Role.Admin)
    @UsePipes(new ReqValidationPipe(updateCategorySchema))
    updateCategory(@Body() updateCategoryDto: UpdateCategoryDto) {
        return this.categoryService.updateCategory(updateCategoryDto);
    }
}
