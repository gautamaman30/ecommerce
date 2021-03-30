import { HttpException, HttpStatus, Logger } from '@nestjs/common';
import {hash, compare} from "bcrypt";
import {sign, Secret} from 'jsonwebtoken';

import {Errors} from "./index";
import {configObj} from '../configEnv';

const logger = new Logger('HelperFunctions');

export class HelperFunctions{

    async hashPassword(password: string){
        try{
            const saltRounds = 10;
            const hashedPassword = await hash(password, saltRounds);
            if(hashedPassword) return hashedPassword;
        } catch(err){
            logger.log(err.message);
            return new HttpException(Errors.INTERNAL_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async comparePassword(password: string, hashedPassword: string){
        try{
            const result = await compare(password, hashedPassword);
            if(result) return true;
            else return false;
        } catch(err){
            logger.log(err.message);
            return new HttpException(Errors.INTERNAL_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    generateRandomId() {
        const str = '1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        let id = '';
        while(id.length < 10) {
            id += str[Math.floor(Math.random()*62)];
        }
        return id;
    }

    generateRandomIdNumbers() {
        const str = '1234567890';
        let id = '';
        while(id.length < 8) {
            id += str[Math.floor(Math.random()*10)];
        }
        return id;
    }

    signToken(payload) {
        const signOptions: any = {
            issuer: configObj.JWT_TOKEN_ISSUER,
            expiresIn: configObj.JWT_TOKEN_EXPIRES_IN,
            algorithm: configObj.JWT_TOKEN_ALGORITHM
        }
        return new Promise((resolve, reject) => {
            sign(payload, <Secret>configObj.SECRET_KEY , signOptions , function(err, token) {
                if(err){
                    logger.log(err.message);
                    reject(Errors.INTERNAL_ERROR);
                }
                if(token){
                    logger.log(token);
                    resolve(token);
                }
            });
        });
    }
}   