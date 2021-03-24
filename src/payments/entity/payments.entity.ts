import {Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn} from 'typeorm';
import { Users } from 'src/users/entity';

@Entity()
export class Payments {
    @PrimaryGeneratedColumn('increment')
    payment_id: number;


}