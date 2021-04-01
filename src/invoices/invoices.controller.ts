import { Controller, UsePipes, UseGuards, Get, Param, Req, Post } from '@nestjs/common';

import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../common/guards';
import { Role } from '../common/enums';
import { Roles } from '../common/customDecorators';
import { ReqValidationPipe } from '../common/pipe';
import { GetInvoicesDto } from './dto';
import { getInvoicesByOrderIdSchema, getInvoicesByPaymentIdSchema} from './validationSchema';
import { InvoicesService } from './invoices.service';

@Controller('invoices')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class InvoicesController {

    constructor(private readonly invoicesService: InvoicesService) {}

    @Get('orders/:order_id')
    @Roles(Role.Buyers)
    @UsePipes(new ReqValidationPipe(getInvoicesByOrderIdSchema))
    findUsersInvoicesByOrders(@Param() getInvoicesDto: GetInvoicesDto, @Req() req) {
        getInvoicesDto.customer_id = req.user.username;
        return this.invoicesService.findInvoices(getInvoicesDto);
    }

    @Get('payments/:payment_id')
    @Roles(Role.Buyers)
    @UsePipes(new ReqValidationPipe(getInvoicesByPaymentIdSchema))
    findUsersInvoicesByPayments(@Param() getInvoicesDto: GetInvoicesDto, @Req() req) {
        getInvoicesDto.customer_id = req.user.username;
        return this.invoicesService.findInvoices(getInvoicesDto);
    }

    @Get('all/orders/:order_id')
    @Roles(Role.Admin)
    @UsePipes(new ReqValidationPipe(getInvoicesByOrderIdSchema))
    findInvoicesByOrders(@Param() getInvoicesDto: GetInvoicesDto, @Req() req) {
        return this.invoicesService.findInvoices(getInvoicesDto);
    }

    @Get('all/payments/:payment_id')
    @Roles(Role.Admin)
    @UsePipes(new ReqValidationPipe(getInvoicesByPaymentIdSchema))
    findInvoicesByPayments(@Param() getInvoicesDto: GetInvoicesDto, @Req() req) {
        return this.invoicesService.findInvoices(getInvoicesDto);
    }
}
