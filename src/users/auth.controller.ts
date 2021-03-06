import { Controller, Post, UsePipes, Body } from '@nestjs/common';

import {UsersService} from './users.service';
import {ReqValidationPipe} from '../common/pipe';
import {LoginUsersDto, CreateUsersDto } from './dto';
import {loginUserSchema, createUserSchema} from './validationSchema';

@Controller('users')
export class AuthController {
    constructor(private usersService: UsersService) {}

    @Post('login')
    @UsePipes(new ReqValidationPipe(loginUserSchema))
    login(@Body() loginUsersDto: LoginUsersDto) {
        return this.usersService.loginUser(loginUsersDto);
    }

    @Post('signup')
    @UsePipes(new ReqValidationPipe(createUserSchema))
    signup(@Body() createUsersDto: CreateUsersDto) {
        return this.usersService.createUser(createUsersDto);
    }
}
