import { Controller, Get, Delete, UseGuards, UsePipes, Req, Param, Post, Body } from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport';

import {OrdersService} from './orders.service';
import { GetOrdersByIdDto, GetOrdersByProductsIdDto, CreateOrdersDto} from './dto';
import { getOrdersByIdSchema, getOrdersByProductIdSchema, deleteOrdersSchema, createOrdersSchema} from './validationSchema';
import {ReqValidationPipe} from '../common/pipe';
import {RolesGuard} from '../common/guards';
import {Roles} from '../common/customDecorators';
import {Role} from '../common/enums';  

@Controller('orders')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class OrdersController {
    constructor(private ordersService: OrdersService) {}

    @Get()
    @Roles(Role.Buyers)
    findUsersOrders(@Req() req) {
        return this.ordersService.findUsersOrders(req.user.username);
    }

    @Get(':order_id')
    @Roles(Role.Buyers)
    @UsePipes(new ReqValidationPipe(getOrdersByIdSchema))
    findUsersOrdersById(@Param() getOrdersByIdDto: GetOrdersByIdDto, @Req() req) {
        getOrdersByIdDto.customer_id = req.user.username;
        return this.ordersService.findOrdersById(getOrdersByIdDto);
    }

    @Get('products/:product_id')
    @Roles(Role.Buyers)
    @UsePipes(new ReqValidationPipe(getOrdersByProductIdSchema))
    findUsersOrdersByProductsId(@Param() getOrdersByProductsIdDto: GetOrdersByProductsIdDto, @Req() req) {
        getOrdersByProductsIdDto.customer_id = req.user.username;
        return this.ordersService.findOrdersByProductsId(getOrdersByProductsIdDto);
    }

    @Get('all')
    @Roles(Role.Admin)
    findAllOrders() {
        return this.ordersService.findAllOrders();
    }
    
    @Get('all/:order_id')
    @Roles(Role.Admin)
    @UsePipes(new ReqValidationPipe(getOrdersByIdSchema))
    findOrdersById(@Param() getOrdersByIdDto: GetOrdersByIdDto) {
        return this.ordersService.findOrdersById(getOrdersByIdDto);
    }

    @Get('all/products/:product_id')
    @Roles(Role.Admin)
    @UsePipes(new ReqValidationPipe(getOrdersByProductIdSchema))
    findOrdersByProductsId(@Param() getOrdersByProductsIdDto: GetOrdersByProductsIdDto) {
        return this.ordersService.findOrdersByProductsId(getOrdersByProductsIdDto);
    } 

    @Post('product')
    @Roles(Role.Buyers)
    @UsePipes(new ReqValidationPipe(createOrdersSchema))
    createOrders(@Body() createOrdersDto: CreateOrdersDto, @Req() req) {
        createOrdersDto.customer_id = req.user.username;
        return this.ordersService.createOrders(createOrdersDto);
    }
    
    @Delete(':order_id')
    @Roles(Role.Admin)
    @UsePipes(new ReqValidationPipe(deleteOrdersSchema))
    deleteOrders(@Param() order_id: string) {
        return this.ordersService.deleteOrders(order_id);
    }
}
