import { Controller, UseGuards, Get, Req} from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport';

import {WalletsService} from './wallets.service';
import {Role} from '../common/enums';
import {Roles} from '../common/customDecorators';
import {RolesGuard} from '../common/guards';

@Controller('wallets')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class WalletsController {

    constructor(private walletsService: WalletsService){}

    @Get('balance')
    @Roles(Role.Buyers, Role.Sellers)
    findWalletBalance(@Req() req) {
        return this.walletsService.findWallet(req.user.username);
    }

}
