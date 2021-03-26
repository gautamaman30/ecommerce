import {Entity, Column, PrimaryColumn, OneToOne, JoinColumn} from 'typeorm';
import { Users } from '../../users/entity';

@Entity()
export class Sellers {
    @PrimaryColumn({
        length: 100
    })
    sellers_id: string;

    @Column({
        length: 100,
        unique: true
    })
    username: string;

    @Column({
        default: false
    })
    status: boolean;

    @Column({
        type: 'date',
        default: () => 'CURRENT_DATE'
    })
    created_on;

    @OneToOne(type => Users)
    @JoinColumn({
        name: 'username',
        referencedColumnName: 'username'
    })
    users: Users;
}