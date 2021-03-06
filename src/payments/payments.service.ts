import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Payments } from './entity';
import {GetBuyersPaymentsByIdDto, GetSellersPaymentsByIdDto, GetSellersPaymentsDto, 
    GetBuyersPaymentsDto, GetPaymentsByIdDto} from './dto';
import {Errors, Messages} from '../common/utils';

@Injectable()
export class PaymentsService {

    private readonly logger = new Logger('PaymentsService');

    constructor(@InjectRepository(Payments) private paymentsRepository: Repository<Payments>) {}

    async findAllPayments() {
        try {
            const payments = await this.paymentsRepository.find();
            return payments;
        } catch(err) {
            this.logger.log(err.message);
            return new HttpException(Errors.INTERNAL_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async findPaymentsById(dto: GetPaymentsByIdDto | GetSellersPaymentsByIdDto | GetBuyersPaymentsByIdDto) {
        try {
            const payment = await this.paymentsRepository.findOne(dto);
            if(!payment) {
                return new HttpException(Errors.PAYMENT_NOT_FOUND, HttpStatus.NOT_FOUND);
            }
            return payment;
        } catch(err) {
            this.logger.log(err.message);
            return new HttpException(Errors.INTERNAL_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async findPaymentsByUser(dto: GetSellersPaymentsDto | GetBuyersPaymentsDto) {
        try {
            const payments = await this.paymentsRepository.find(dto);
            if(payments.length === 0) {
                return new HttpException(Errors.PAYMENT_NOT_FOUND, HttpStatus.NOT_FOUND);
            }
            return payments;
        } catch(err) {
            this.logger.log(err.message);
            return new HttpException(Errors.INTERNAL_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async deletePayments(payment_id: string) {
        try {
            const result = await this.paymentsRepository.delete(payment_id);
            if(result.affected === 0) {
                return new HttpException(Errors.PAYMENT_NOT_FOUND, HttpStatus.NOT_FOUND);
            }
            return {message: Messages.PAYMENT_DELETED_SUCCESSFULLY, payment_id};
        } catch(err) {
            this.logger.log(err.message);
            return new HttpException(Errors.INTERNAL_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
