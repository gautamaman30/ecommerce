import {Entity, Column, PrimaryColumn, ManyToOne, OneToOne, JoinColumn, OneToMany} from 'typeorm';

import { Payments } from '../../payments/entity';
import { Users } from '../../users/entity';
import { Products } from '../../products/entity';

@Entity()
export class Orders {

    @PrimaryColumn({
        length: 100
    })
    order_id: string;

    @Column({
        length: 100,
        unique: true
    })
    payment_id: string;

    @Column({
        length: 100
    })
    customer_id: string;

    @Column({
        length: 100
    })
    product_id: string;

    @Column({
        type: 'decimal',
        precision: 10,
        scale: 2
    }) 
    amount: number;

    @Column() 
    quantity: number;

    @Column({
        type: 'date',
        default: () => 'CURRENT_DATE'
    })
    date;

    @Column({
        type: 'time',
        default: () => 'CURRENT_TIME'
    })
    time;

    @ManyToOne(type => Products)
    @JoinColumn({
        name: 'product_id',
        referencedColumnName: 'product_id'
    })
    products: Products;

    @ManyToOne(type => Users)
    @JoinColumn({
        name: 'customer_id',
        referencedColumnName: 'username'
    })
    users: Users;

    @OneToOne(type => Payments)
    @JoinColumn({
        name: 'payment_id',
        referencedColumnName: 'payment_id'
    })
    payments: Payments;
}   