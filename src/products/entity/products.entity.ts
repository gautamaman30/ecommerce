import { Entity, Column, PrimaryColumn, JoinColumn, ManyToOne} from "typeorm"
import {Sellers} from '../../sellers/entity';
import {Category} from './category.entity';

@Entity()
export class Products {
    @PrimaryColumn({
        length: 100
    })
    product_id: string;

    @Column({
        length: 100
    })
    name: string;

    @Column({
        length: 200,
        nullable: true
    })
    description: string;

    @Column({
        length: 100,
        nullable: true
    })
    brand_name: string;

    @Column({
        length: 50,
        nullable: true
    })
    color: string;

    @Column({
        type: 'decimal',
        precision: 10,
        scale: 2,
        default: 0.00
    })
    price: number;

    @Column({
        default: 1
    })
    quantity: number;

    @Column({
        type: 'date',
        default: () => 'CURRENT_DATE'
    })
    added_on;

    @Column({
        length: 300,
        nullable: true
    })
    image: string;

    @Column({
        length: 100
    })
    product_category: string;

    @ManyToOne(type => Category)
    @JoinColumn({
        name: 'product_category',
        referencedColumnName: 'category_name'
    })
    category: Category;

    @Column({
        length: 100
    })
    sellers_id: string;

    @ManyToOne(type => Sellers)
    @JoinColumn({
        name: 'sellers_id',
        referencedColumnName: 'sellers_id'
    })
    seller: Sellers;
}