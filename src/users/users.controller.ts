import { Controller, Get, Delete, Put, UseGuards, UsePipes, Req, Body, Param, Post, UseInterceptors, UploadedFile } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { diskStorage } from 'multer';

import {UsersService} from './users.service';
import {ReqValidationPipe} from '../common/pipe';
import {RolesGuard} from '../common/guards';
import {Roles} from '../common/customDecorators';
import {Role} from '../common/enums';  
import {UpdateUsersDto } from './dto';
import { helperFunctions } from '../common/utils'; 
import {updateUserSchema, getUsersByUsernameSchema, deleteUsersSchema} from './validationSchema';

@Controller('users')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class UsersController {
    constructor(private usersService: UsersService) {}

    @Get()
    @Roles(Role.Buyers, Role.Sellers)
    findUser(@Req() req) {
        return this.usersService.findUser(req.user.username);
    }
    
    @Get('all')
    @Roles(Role.Admin)
    findAllUsers() {
        return this.usersService.findAllUsers();
    }
    
    @Get(':username')
    @Roles(Role.Admin)
    @UsePipes(new ReqValidationPipe(getUsersByUsernameSchema))
    findUserByUsername(@Param() username: string) {
        return this.usersService.findUser(username);
    } 
    
    @Delete()
    @Roles(Role.Buyers, Role.Sellers)
    deleteUser(@Req() req) {
        return this.usersService.deleteUser(req.user.username);
    }

    @Delete(':username')
    @Roles(Role.Admin)
    @UsePipes(new ReqValidationPipe(deleteUsersSchema))
    deleteUserByUsername(@Param() username: string) {
        return this.usersService.deleteUser(username);
    }

    @Put()
    @Roles(Role.Buyers, Role.Sellers)
    @UsePipes(new ReqValidationPipe(updateUserSchema))
    updateUser(@Body() updateUsersDto: UpdateUsersDto, @Req() req) {
        updateUsersDto.username = req.user.username;
        return this.usersService.updateUser(updateUsersDto);
    }

    @Post('upload/avatar')
    @Roles(Role.Buyers, Role.Sellers)
    @UseInterceptors(FileInterceptor('avatar', { storage: diskStorage({
            filename: helperFunctions.editFileName,
            destination: './static'
        }), fileFilter: helperFunctions.imageFilter,  limits: {
            files: 1,
            fileSize: 150000,
    }}))
    uploadAvatar(@UploadedFile() file: Express.Multer.File, @Req() req) {
        return this.usersService.uploadAvatar(file, req.user.username);
    }
}
