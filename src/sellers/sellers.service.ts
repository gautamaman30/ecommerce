import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository} from '@nestjs/typeorm';
import { Repository, QueryFailedError, Connection} from 'typeorm';

import { Sellers} from './entity';
import { Users} from '../users/entity';
import { Wallets } from '../wallets/entity';
import { VerifySellersAccountDto, DeleteSellersAccountDto} from './dto';
import { Errors, Messages, helperFunctions} from '../common/utils'
import { UsersService } from '../users/users.service';

@Injectable()
export class SellersService {

    private readonly logger = new Logger('SellersService');

    constructor(@InjectRepository(Sellers) private sellersRepository: Repository<Sellers>, 
        private readonly usersService: UsersService, 
        private connection: Connection){}

    async createSellersAccount(username: string) {
        try {
            const sellers_id = helperFunctions.generateRandomId();
            const balance: number = 0.00;
            const seller =  await this.connection.transaction(async manager => {
                await manager.insert(Sellers, {sellers_id, username});
                await manager.update(Wallets, { username}, {balance});
            });
            return {message: Messages.SELLER_CREATED_SUCCESSFULLY, sellers_id, username};
        } catch(err) {
            this.logger.log(err.message);
            if(err instanceof QueryFailedError) {
                return new HttpException(Errors.USERNAME_ALREADY_EXISTS, HttpStatus.BAD_REQUEST);
            }
            return new HttpException(Errors.INTERNAL_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async verifySellersAccount(verifySellersAccountDto: VerifySellersAccountDto) {
        try {
            const seller = await this.sellersRepository.update(verifySellersAccountDto, {status: true});
            if(seller.affected === 0) {
                return new HttpException(Errors.SELLER_NOT_FOUND, HttpStatus.NOT_FOUND);
            }
            const {username, ...rest} = await this.sellersRepository.findOne(verifySellersAccountDto);
            return this.usersService.updateUsersRoles(username, 'sellers');
        } catch(err) {
            this.logger.log(err.message);
            return new HttpException(Errors.INTERNAL_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async deleteSellersAccount(deleteSellersAccountDto: DeleteSellersAccountDto) {
        try {
            const result = await this.connection.transaction(async manager => {
                const seller = await manager.findOne(Sellers, deleteSellersAccountDto);
                if(seller) {
                    await manager.delete(Sellers, deleteSellersAccountDto);
                    await manager.delete(Wallets, {usename: seller.username});
                    await manager.delete(Users, {usename: seller.username});
                } 
                return seller;
            });
            if(!result) {
                return new HttpException(Errors.SELLER_NOT_FOUND, HttpStatus.NOT_FOUND);
            }
            return {message: Messages.SELLER_DELETED_SUCCESSFULLY};
        } catch(err) {
            this.logger.log(err.message);
            return new HttpException(Errors.INTERNAL_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async findSellersByUsername(username: string) {
        try {
            const seller = await this.sellersRepository
                .createQueryBuilder("sellers")
                .innerJoinAndSelect('users', 'users', 'users.username = sellers.username')
                .where('sellers.username = :username', {username})
                .getOne();
            if(!seller) {
                return new HttpException(Errors.SELLER_NOT_FOUND_USERNAME, HttpStatus.NOT_FOUND);
            }
            return seller;
        } catch(err) {
            this.logger.log(err.message);
            return new HttpException(Errors.INTERNAL_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async findSellersById(sellers_id: string) {
        try {
            const seller = await this.sellersRepository.findOne(sellers_id);
            if(!seller) {
                return new HttpException(Errors.SELLER_NOT_FOUND, HttpStatus.NOT_FOUND);
            }
            return seller;
        } catch(err) {
            this.logger.log(err.message);
            return new HttpException(Errors.INTERNAL_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async findAllSellers() {
        try {
            const sellers = await this.sellersRepository.find();
            return sellers;
        } catch(err) {
            this.logger.log(err.message);
            return new HttpException(Errors.INTERNAL_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
  