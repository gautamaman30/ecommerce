import { HttpException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../../users/users.service';
import { SellersService } from '../../sellers/sellers.service';
import {configObj} from '../configEnv';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        public readonly usersService: UsersService,
        private readonly sellersService: SellersService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configObj.SECRET_KEY,
        });
    }
    async validate({ iat, exp, username }) {
        const timeDiff = exp - iat;
        if (timeDiff <= 0) {
            throw new UnauthorizedException();
        }
        let user: any = await this.usersService.findOne(username);
        if (user instanceof HttpException) {
            throw new UnauthorizedException();
        }
        
        if(user.roles === 'sellers') {
            const seller = await this.sellersService.findSellersByUsername(username);
            if(seller instanceof HttpException) {
                throw new UnauthorizedException();
            }
            user.sellers_id = seller.sellers_id;
        }
        return user;
    }
}