import {Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn} from 'typeorm';
import { Users } from 'src/users/entity';

@Entity()
export class Wallets {
    @PrimaryGeneratedColumn('increment')
    wallet_id: number;

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