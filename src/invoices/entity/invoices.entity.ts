//sample comment
import { Entity, Column, PrimaryColumn, OneToOne, JoinColumn, ManyToOne} from 'typeorm';

import { Orders } from '../../orders/entity';
import { Payments } from '../../payments/entity';
import { Users } from '../../users/entity';

@Entity() 
export class Invoices {
    @PrimaryColumn({
        length: 100
    })
    invoice_id: string;

    @Column({
        length: 100,
        unique: true
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
    customer_name: string;

    @Column({
        length: 100
    })
    customer_email: string;

    @Column({
        length: 100
    })
    sold_by: string;

    @Column({
        length: 100
    })
    product_name: string;

    @Column({
        type: 'decimal',
        precision: 10,
        scale: 2
    })
    total_amount: number;

    @Column({
        type: 'decimal',
        precision: 10,
        scale: 2
    })
    unit_price: number;

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

    @ManyToOne(type => Users)
    @JoinColumn({
        name: 'customer_id',
        referencedColumnName: 'username'
    })
    users: Users;

    @OneToOne(type => Orders)
    @JoinColumn({
        name: 'order_id',
        referencedColumnName: 'order_id'
    })
    orders: Orders;

    @OneToOne(type => Payments)
    @JoinColumn({
        name: 'payment_id',
        referencedColumnName: 'payment_id'
    })
    payments: Payments;
}