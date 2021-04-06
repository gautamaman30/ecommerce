import { Controller, UseGuards, UsePipes, Body, Param, Query, Req, Get, Delete, Put, Post } from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport';

import {SellersService} from './sellers.service';
import { RolesGuard } from '../common/guards';
import {ReqValidationPipe} from '../common/pipe';
import {Role} from '../common/enums';
import {Roles} from '../common/customDecorators';
import {VerifySellersAccountDto, DeleteSellersAccountDto} from './dto';
import {verifySellersAccountSchema, deleteSellersAccountSchema, getSellerSchema} from './validationSchema';
 
@Controller('sellers')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class SellersController {
    constructor(private sellersService: SellersService) {}

    @Post('account/apply')
    @Roles(Role.Buyers)
    createSellersAccount(@Req() req) {
        return this.sellersService.createSellersAccount(req.user.username);
    }

    @Put('account/verify')
    @Roles(Role.Admin)
    @UsePipes(new ReqValidationPipe(verifySellersAccountSchema))
    verifySellersAccount(@Body() verifySellersAccountDto: VerifySellersAccountDto) {
        return this.sellersService.verifySellersAccount(verifySellersAccountDto);
    }

    @Delete('account')
    @Roles(Role.Admin)
    @UsePipes(new ReqValidationPipe(deleteSellersAccountSchema))
    deleteSellersAccount(@Body() deleteSellersAccountDto: DeleteSellersAccountDto) {
        return this.sellersService.deleteSellersAccount(deleteSellersAccountDto);
    }

    @Get('')
    @Roles(Role.Sellers)
    findSeller(@Req() req) {
        return this.sellersService.findSellersByUsername(req.user.username);
    }   

    @Get('all')
    @Roles(Role.Admin, Role.Buyers, Role.Sellers)
    findAllSellers() {
        return this.sellersService.findAllSellers();
    }

    @Get(':sellers_id')
    @Roles(Role.Admin, Role.Buyers, Role.Sellers)
    @UsePipes(new ReqValidationPipe(getSellerSchema)) 
    findSellersById(@Param() sellers_id: string) {
        return this.sellersService.findSellersById(sellers_id);
    }
}
