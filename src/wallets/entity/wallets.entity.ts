import {Entity, Column, PrimaryColumn, OneToOne, JoinColumn} from 'typeorm';
import { Users } from 'src/users/entity';

@Entity()
export class Wallets {
    @PrimaryColumn({
        length: 100
    })
    wallet_id: string;

    @Column({
        length: 100,
        unique: true
    })
    username: string;

    @Column({
        type: 'decimal',
        precision: 10,
        scale: 2,
        default: 0.00
    })
    balance: number;

    @Column({
        type: 'date',
        default: () => 'CURRENT_DATE'
    })
    created_on;

    @Column({
        type: 'date',
        default: () => 'CURRENT_DATE',
        nullable: true
    })
    last_updated;

    @OneToOne(type => Users)
    @JoinColumn({
        name: 'username',
        referencedColumnName: 'username'
    })
    users: Users;
}