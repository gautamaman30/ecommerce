import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectConnection, InjectRepository} from '@nestjs/typeorm';
import { Repository, QueryFailedError, Connection} from 'typeorm';
import { Sellers} from './entity';
import { Wallets } from '../wallets/entity';
import { VerifySellersAccountDto, DeleteSellersAccountDto} from './dto';
import { Errors, Messages, helperFunctions} from '../common/utils'
import { UsersService } from './users.service';

@Injectable()
export class SellersService {
    constructor(@InjectRepository(Sellers) private sellersRepository: Repository<Sellers>, 
        private readonly usersService: UsersService, 
        private connection: Connection){}

    async createSellersAccount(username: string) {
        try {
            const sellers_id = helperFunctions.generateRandomId();
            
            const seller =  await this.connection.transaction(async manager => {
                await manager.insert(Sellers, {sellers_id, username});
                await manager.update(Wallets, { username}, {balance: 0.00});
            });
            return {message: Messages.SELLER_CREATED_SUCCESSFULLY, sellers_id, username};
        } catch(err) {
            console.log(err.message);
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
            console.log(err.message);
            return new HttpException(Errors.INTERNAL_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async deleteSellersAccount(deleteSellersAccountDto: DeleteSellersAccountDto) {
        try {
            const seller = await this.sellersRepository.delete(deleteSellersAccountDto);
            if(seller.affected === 0) {
                return new HttpException(Errors.SELLER_NOT_FOUND, HttpStatus.NOT_FOUND);
            }
            return {message: Messages.SELLER_DELETED_SUCCESSFULLY};
        } catch(err) {
            console.log(err.message);
            return new HttpException(Errors.INTERNAL_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async findSellersByUsername(username: string) {
        try {
            const seller = await this.sellersRepository
                .createQueryBuilder("sellers")
                .innerJoinAndSelect('users', 'users', 'users.username = sellers.username')
                .where('sellers.username := username', {username})
                .getOne();
            if(!seller) {
                return new HttpException(Errors.SELLER_NOT_FOUND_USERNAME, HttpStatus.NOT_FOUND);
            }
            return seller;
        } catch(err) {
            console.log(err.message);
            return new HttpException(Errors.INTERNAL_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async findSellersById(sellers_id: string) {
        try {
            const seller = await this.sellersRepository
                 .createQueryBuilder("sellers")
                .innerJoinAndSelect('users', 'users', 'users.username = sellers.username')
                .where('sellers.seller_id := sellers_id', {sellers_id})
                .getOne();
            if(!seller) {
                return new HttpException(Errors.SELLER_NOT_FOUND, HttpStatus.NOT_FOUND);
            }
            return seller;
        } catch(err) {
            console.log(err.message);
            return new HttpException(Errors.INTERNAL_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async findAllSellers() {
        try {
            const sellers = await this.sellersRepository.find();
            return sellers;
        } catch(err) {
            console.log(err.message);
            return new HttpException(Errors.INTERNAL_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
  