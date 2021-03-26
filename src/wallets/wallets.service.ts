import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from 'typeorm';

import { Wallets } from './entity';
import { Errors } from '../common/utils/index';


@Injectable()
export class WalletsService {
    constructor(@InjectRepository(Wallets) private walletsRepository: Repository<Wallets>) {}

    async findWallet(username: string) {
        try {
            const result = await this.walletsRepository.findOne({username});
            if(!result) {
                return new HttpException(Errors.WALLET_NOT_FOUND, HttpStatus.NOT_FOUND);
            }
            return result;
        } catch(err) {
            console.log(err.message);
            return new HttpException(Errors.INTERNAL_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
