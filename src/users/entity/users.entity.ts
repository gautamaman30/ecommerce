import { Entity, Column, PrimaryColumn} from "typeorm";

type roles = 'buyers' | 'sellers' | 'admin';

@Entity()
export class Users {
    @Column({
        generated: true
    })
    id: number;

    @PrimaryColumn({
        length: 100,
    })
    username: string;

    @Column({
        length: 100,
        unique: true
    })
    email: string;

    @Column({
        length: 100
    })
    first_name: string;

    @Column({
        length: 100
    })
    last_name: string;

    @Column({
        length: 200
    })
    password: string;

    @Column({
        default: 'buyers'
    })
    roles: roles;

    @Column({
        length: 300,
        nullable: true
    })
    avatar: string;
}