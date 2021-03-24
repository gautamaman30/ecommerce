import { Controller, Get, Delete, Put, UseGuards, UsePipes, Req, Body, Param } from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport';

import {UsersService} from './users.service';
import {ReqValidationPipe} from '../common/pipe';
import {RolesGuard} from '../common/guards';
import {Roles} from '../common/customDecorators';
import {Role} from '../common/enums';
import {UpdateUsersDto } from './dto';
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
    
    @Get(':username')
    @Roles(Role.Admin)
    @UsePipes(new ReqValidationPipe(getUsersByUsernameSchema))
    findUserByUsername(@Param() username: string) {
        return this.usersService.findUser(username);
    }
    
    @Get('all')
    @Roles(Role.Admin)
    findAllUsers() {
        return this.usersService.findAllUsers();
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
}
