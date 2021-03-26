import { Controller, Get, Delete, UseGuards, UsePipes, Req, Param, Post, Body } from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport';

import {PaymentsService} from './payments.service';
import {GetBuyersPaymentsDto, GetSellersPaymentsByIdDto, GetSellersPaymentsDto, 
    GetBuyersPaymentsByIdDto, GetPaymentsByIdDto} from './dto';
import { getPaymentsByIdSchema, deletePaymentsByIdSchema} from './validationSchema';
import {ReqValidationPipe} from '../common/pipe';
import {RolesGuard} from '../common/guards';
import {Roles} from '../common/customDecorators';
import {Role} from '../common/enums';  

@Controller('payments')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class PaymentsController {
    constructor(private paymentsService: PaymentsService) {}

    @Get('')
    @Roles(Role.Admin)
    findAllPayments(@Req() req) {
        return this.paymentsService.findAllPayments();
    }

    @Get(':payment_id')
    @Roles(Role.Admin)
    @UsePipes(new ReqValidationPipe(getPaymentsByIdSchema))
    findPaymentsById(@Param() getPaymentsByIdDto: GetPaymentsByIdDto) {
        return this.paymentsService.findPaymentsById(getPaymentsByIdDto);
    }

    @Get('buyers')
    @Roles(Role.Buyers)
    findBuyersPayments(@Req() req) {
        let getBuyersPaymentsDto = new GetBuyersPaymentsDto();
        getBuyersPaymentsDto.buyers_id = req.user.username;
        return this.paymentsService.findPaymentsByUser(getBuyersPaymentsDto);
    }

    @Get('buyers/:payment_id')
    @Roles(Role.Buyers)
    @UsePipes(new ReqValidationPipe(getPaymentsByIdSchema))
    findBuyersPaymentsById(@Param() getBuyersPaymentsByIdDto: GetBuyersPaymentsByIdDto, @Req() req) {
        getBuyersPaymentsByIdDto.buyers_id = req.user.username;
        return this.paymentsService.findPaymentsById(getBuyersPaymentsByIdDto);
    }

    @Get('sellers')
    @Roles(Role.Sellers)
    findSellersPayments(@Req() req) {
        let getSellersPaymentsDto = new GetSellersPaymentsDto();
        getSellersPaymentsDto.sellers_id = req.user.sellers_id;
        return this.paymentsService.findPaymentsByUser(getSellersPaymentsDto);
    }

    @Get('sellers/:payment_id')
    @Roles(Role.Sellers)
    @UsePipes(new ReqValidationPipe(getPaymentsByIdSchema))
    findSellersPaymentsById(@Param() getSellersPaymentsByIdDto: GetSellersPaymentsByIdDto, @Req() req) {
        getSellersPaymentsByIdDto.sellers_id = req.user.sellers_id;
        return this.paymentsService.findPaymentsById(getSellersPaymentsByIdDto);
    }
    
    @Delete(':payment_id')
    @Roles(Role.Admin)
    @UsePipes(new ReqValidationPipe(deletePaymentsByIdSchema))
    deletePayments(@Param() payment_id: string) {
        return this.paymentsService.deletePayments(payment_id);
    }
}
