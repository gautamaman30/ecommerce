import { Entity, Column, PrimaryColumn} from "typeorm"

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
        length: 200,
        nullable: true
    })
    title: string;
}