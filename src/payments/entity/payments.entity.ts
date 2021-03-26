import {Entity, Column, PrimaryColumn, ManyToOne, JoinColumn} from 'typeorm';

import { Wallets } from '../../wallets/entity';
import { Users,} from '../../users/entity';
import { Sellers} from '../../sellers/entity';

@Entity()
export class Payments {
    @PrimaryColumn({
        length: 100
    })
    payment_id: string;

    @Column({
        type: 'decimal',
        precision: 10,
        scale: 2
    }) 
    amount: number;

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

    @Column()
    paid_from: number;

    @Column()
    paid_to: number;

    @ManyToOne(type => Wallets)
    @JoinColumn({
        name: 'paid_from',
        referencedColumnName: 'wallet_id'
    })
    wallet_from: Wallets;

    @ManyToOne(type => Wallets)
    @JoinColumn({
        name: 'paid_to',
        referencedColumnName: 'wallet_id'
    })
    wallet_to: Wallets;

    @Column({
        length: 100
    })
    buyers_id: string;
    
    @Column({
        length: 100
    })
    sellers_id: string;

    @ManyToOne(type => Users)
    @JoinColumn({
        name: 'buyers_id',
        referencedColumnName: 'username'
    })
    users: Users;

    @ManyToOne(type => Sellers)
    @JoinColumn({
        name: 'sellers_id',
        referencedColumnName: 'sellers_id'
    })
    sellers: Sellers;
}   