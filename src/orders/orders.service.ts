import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Connection } from 'typeorm';

import { Orders } from './entity';
import { Payments } from '../payments/entity';
import { Wallets } from '../wallets/entity';
import { Products } from '../products/entity';
import { Sellers } from '../sellers/entity';
import { Users } from '../users/entity';
import { InvoicesService } from '../invoices/invoices.service';
import {GetOrdersByProductsIdDto, GetOrdersByIdDto, CreateOrdersDto} from './dto';
import {Errors, helperFunctions, Messages} from '../common/utils';

@Injectable()
export class OrdersService {

    private readonly logger = new Logger('OrdersService');

    constructor(@InjectRepository(Orders) private ordersRepository: Repository<Orders>, 
        private connection: Connection, private invoicesService: InvoicesService) {}

    async findUsersOrders(customer_id: string) {
        try {
            const orders = await this.ordersRepository.find({customer_id});
            return orders;
        } catch(err) {
            this.logger.log(err.message);
            return new HttpException(Errors.INTERNAL_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async findSellersOrders(sellers_id: string) {
        try {
            const orders = await this.ordersRepository
                .createQueryBuilder("orders")
                .innerJoinAndSelect("products", "products", "products.product_id = orders.product_id")
                .where("products.sellers_id = :sellers_id", {sellers_id})
                .getMany();
            return orders;
        } catch(err) {
            this.logger.log(err.message);
            return new HttpException(Errors.INTERNAL_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async findAllOrders() {
        try {
            const orders = await this.ordersRepository.find();
            return orders;
        } catch(err) {
            this.logger.log(err.message);
            return new HttpException(Errors.INTERNAL_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async findOrdersById(getOrdersByIdDto: GetOrdersByIdDto) {
        try {
            const order = await this.ordersRepository.findOne(getOrdersByIdDto);
            if(!order) {
                return new HttpException(Errors.ORDER_NOT_FOUND, HttpStatus.NOT_FOUND);
            }
            return order;
        } catch(err) {
            this.logger.log(err.message);
            return new HttpException(Errors.INTERNAL_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async findOrdersByProductsId(getOrdersByProductsIdDto: GetOrdersByProductsIdDto) {
        try {
            const orders = await this.ordersRepository.find(getOrdersByProductsIdDto);
            return orders;
        } catch(err) {
            this.logger.log(err.message);
            return new HttpException(Errors.INTERNAL_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async createOrders(createOrdersDto: CreateOrdersDto) {
        try {
            const payment_id = helperFunctions.generateRandomId();
            const order_id = helperFunctions.generateRandomId();
            
            const result = await this.connection.transaction(async manager => {

                const product = await manager.findOne(Products, {product_id: createOrdersDto.product_id});
                
                if(!product) return new HttpException(Errors.PRODUCT_NOT_FOUND, HttpStatus.NOT_FOUND);

                if(createOrdersDto.quantity > product.quantity) {
                    return new HttpException(Errors.PRODUCT_QUANTITY_NOT_AVAILABLE, HttpStatus.BAD_REQUEST);
                }

                
                const total_amount = product.price * createOrdersDto.quantity;
                const buyer_wallet = await manager.findOne(Wallets, {username: createOrdersDto.customer_id});
                if(buyer_wallet.balance < total_amount) {
                    return new HttpException(Errors.INSUFFICIENT_WALLET_BALANCE, HttpStatus.BAD_REQUEST);
                }
                buyer_wallet.balance -= total_amount; 
                
                const seller = await manager.findOne(Sellers, {sellers_id: product.sellers_id});
                const seller_wallet = await manager.findOne(Wallets, {username: seller.username});
                seller_wallet.balance =  Number(total_amount) + Number(seller_wallet.balance);

                product.quantity -= createOrdersDto.quantity;    

                await manager.save(Wallets, buyer_wallet);
                await manager.save(Wallets, seller_wallet);
                await manager.save(Products, product);
                
                await manager.insert(Payments, {
                    payment_id, 
                    amount: total_amount, 
                    buyers_id: createOrdersDto.customer_id,
                    sellers_id: product.sellers_id,
                    paid_from: buyer_wallet.wallet_id, 
                    paid_to: seller_wallet.wallet_id
                }); 

                await manager.insert(Orders, {
                    order_id, 
                    product_id: product.product_id,
                    payment_id,
                    customer_id: createOrdersDto.customer_id,
                    quantity: createOrdersDto.quantity,
                    amount: total_amount
                });

                const user = await manager.findOne(Users, {username: createOrdersDto.customer_id});

                return {
                    customer_name: `${user.first_name} ${user.last_name}`,
                    customer_email: `${user.email}`,
                    sold_by: seller.username,
                    unit_price: product.price,
                    product_name: product.name,
                    total_amount
                };
            });

            if(result instanceof HttpException) {
                return result;
            }


            const invoice = await this.invoicesService.createInvoices({
                order_id,
                customer_id: createOrdersDto.customer_id,
                customer_name: result.customer_name,
                customer_email: result.customer_email,
                sold_by: result.sold_by,
                quantity: createOrdersDto.quantity,
                unit_price: result.unit_price,
                product_name: result.product_name,
                payment_id,
                total_amount: result.total_amount
            });

            return {message: Messages.ORDER_CREATED_SUCCESSFULLY, order_id};
        } catch(err) {
            this.logger.log(err.message);
            return new HttpException(Errors.INTERNAL_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async deleteOrders(order_id) {
        try {
            const result = await this.connection.transaction(async manager => {
                const order = await manager.findOne(Orders, order_id);
                if(!order) return new HttpException(Errors.ORDER_NOT_FOUND, HttpStatus.NOT_FOUND);
                
                const payment = await manager.findOne(Payments, {payment_id: order.payment_id});
                
                let buyer = await manager.findOne(Wallets, {wallet_id: payment.paid_from});
                buyer.balance = Number(payment.amount) + Number(buyer.balance);
                await manager.save(Wallets, buyer);
                
                let seller = await manager.findOne(Wallets, {wallet_id: payment.paid_to});
                seller.balance -= payment.amount;
                await manager.save(Wallets, seller);

                await manager.update(Products, {product_id: order.product_id}, {quantity: () => `quantity + ${order.quantity}`});

                return manager.delete(Orders, order_id);
            });

            if(result instanceof HttpException) {
                return result;
            }
            return {message: Messages.ORDER_DELETED_SUCCESSFULLY, order_id};
        } catch(err) {
            this.logger.log(err.message);
            return new HttpException(Errors.INTERNAL_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
