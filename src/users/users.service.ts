import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { QueryFailedError, Repository, Connection } from 'typeorm';
import { S3 } from 'aws-sdk';
import { configObj } from '../common/configEnv';
import { createReadStream, unlink} from 'fs';
import { join } from 'path';

import { Users } from "./entity";
import { Wallets } from '../wallets/entity';
import { GetUsersDto, UpdateUsersDto, CreateUsersDto, LoginUsersDto } from "./dto/index";
import { Errors, Messages, helperFunctions } from '../common/utils/index';

@Injectable()
export class UsersService {

    private readonly logger = new Logger('UsersService');

    private s3 = new S3({
        credentials: {
        accessKeyId: configObj.AWS_ACCESS_KEY_ID,
        secretAccessKey: configObj.AWS_SECRET_ACCESS_KEY
        },
        region: configObj.AWS_REGION
    });

    constructor(@InjectRepository(Users) private usersRepository: Repository<Users>
        , private connection: Connection) {}

    async findUser(username: string) {
        try {
            let result = await this.usersRepository.findOne(username);
            if(!result) {
                return new HttpException(Errors.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
            }
            return new GetUsersDto(result);
        } catch(err) {
            this.logger.log(err.message);
            return new HttpException(Errors.INTERNAL_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
        } 
    }

    async findAllUsers() {
        try {
            let result = await this.usersRepository.find();
            return result.map(item => new GetUsersDto(item));
        } catch(err) {
            this.logger.log(err.message);
            return new HttpException(Errors.INTERNAL_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
        } 
    }

    async findOne(username: string) {
        try {
            let result = await this.usersRepository.findOne(username);
            return result;
        } catch(err) {
            this.logger.log(err.message);
            return new HttpException(Errors.INTERNAL_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
        } 
    }

    async createUser(createUsersDto: CreateUsersDto) {
        try {
            const hashedPassword = await helperFunctions.hashPassword(createUsersDto.password);
            if(hashedPassword instanceof HttpException) {
                return hashedPassword;
            }
            createUsersDto.password = hashedPassword;

            const result = await this.connection.transaction(async manager => {
                await manager.insert(Users, createUsersDto);
                await manager.insert(Wallets, { 
                    wallet_id: helperFunctions.generateRandomIdNumbers(),
                    username: createUsersDto.username,
                    balance: 100000.00
                })
            });

            const token = await helperFunctions.signToken({username: createUsersDto.username});
            return {message: Messages.USER_CREATED_SUCCESSFULLY, token};
        } catch(err) {
            this.logger.log(err.message);
            if(err instanceof QueryFailedError) {
                return new HttpException(Errors.USERNAME_ALREADY_EXISTS, HttpStatus.BAD_REQUEST);
            }
            return new HttpException(Errors.INTERNAL_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async loginUser(loginUsersDto: LoginUsersDto) {
        try {
            const user = await this.usersRepository.findOne({username: loginUsersDto.username});
            if(!user) {
                return new HttpException(Errors.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
            }
            const result = await helperFunctions.comparePassword(loginUsersDto.password, user.password);
            if(!result) {
                return new HttpException(Errors.INCORRECT_PASSWORD, HttpStatus.BAD_REQUEST);
            }
            const token = await helperFunctions.signToken({username: loginUsersDto.username});
            return {message: Messages.USER_LOGGED_IN_SUCCESSFULLY, token, statusCode: HttpStatus.OK};
        } catch(err) {
            this.logger.log(err.message);
            return new HttpException(Errors.INTERNAL_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async deleteUser(username) {
        try {
            const result = await this.connection.transaction(async manager => {
                const user = await manager.delete(Users, username);
                await manager.delete(Wallets, username);
                return user;
            });

            if(result.affected === 0) {
                return new HttpException(Errors.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
            }
            return {message: Messages.USER_DELETED_SUCCESSFULLY};
        } catch(err) {
            this.logger.log(err.message);
            return new HttpException(Errors.INTERNAL_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async updateUser(updateUsersDto: UpdateUsersDto) {
        try {
            let updateDoc: any = {};
            if(updateUsersDto.first_name) updateDoc.first_name = updateUsersDto.first_name;
            if(updateUsersDto.last_name) updateDoc.last_name = updateUsersDto.last_name;

            if(Object.keys(updateDoc).length === 0) {
                return new HttpException(Errors.USER_UPDATE_FIELDS_REQUIRED, HttpStatus.BAD_REQUEST);  
            }
                
            const result = await this.usersRepository.update({username: updateUsersDto.username}, updateDoc);
            if(result.affected === 0) {
                return new HttpException(Errors.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
            }
            return {message: Messages.USER_UPDATED_SUCCESSFULLY};
        } catch(err) {
            this.logger.log(err.message);
            return new HttpException(Errors.INTERNAL_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async updateUsersRoles(username: string, roles: 'buyers' | 'sellers' | 'admin') {
        try {
            const result = await this.usersRepository.update({username}, {roles});
            if(result.affected === 0) {
                return new HttpException(Errors.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
            }
            return {message: Messages.USER_UPDATED_SUCCESSFULLY};
        } catch(err) {
            this.logger.log(err.message);
            return new HttpException(Errors.INTERNAL_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async uploadAvatar(file, username: string) {
        try {       

            if(!file) {
                return new HttpException(Errors.AVATAR_NULL, HttpStatus.BAD_REQUEST);
            }

            const file_path = join(process.cwd(), 'static', file.filename);

            const stream = createReadStream(join(process.cwd(), 'static', file.filename)); 
            stream.on('error', (err) => {
                this.logger.log(err.message);
            });

            const uploadParams = {
                Bucket: configObj.AWS_BUCKET_NAME,
                Key: file.filename,
                Body: stream
            };

            this.s3.upload(uploadParams, (err, data) => {
                if(err) {
                    this.logger.log(err);
                }
                if(data) {
                    this.logger.log(data);
                }
            }); 

            const url: string = await new Promise((resolve, reject) => {
                this.s3.getSignedUrl('getObject', {   
                        Bucket: configObj.AWS_BUCKET_NAME, 
                        Key: file.filename, 
                        Expires: 432000     
                    }, (err, url) => {
                        if(err) this.logger.log(err);
                        if(url) resolve(url);
                    }
                );
            });

            const result = await this.usersRepository.update({username}, {avatar: url});

            if(result.affected === 0) {
                return new HttpException(Errors.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
            }

            unlink(file_path, () => {
                this.logger.log(Messages.AVATAR_DELETED_SUCCESSFULLY);
            });

            return { message: Messages.AVATAR_UPLOADED_SUCCESSFULLY, status: HttpStatus.OK };
        } catch(err) {
            this.logger.log(err.message);
            return new HttpException(Errors.INTERNAL_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}