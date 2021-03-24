import { Entity, Column, PrimaryColumn} from "typeorm"

@Entity()
export class Category {
    @Column({
        generated: "increment"
    })
    id: number;

    @PrimaryColumn({
        length: 100
    })
    category_name: string;

    @Column({
        length: 200,
        nullable: true
    })
    description: string;

    @Column({
        length: 300,
        nullable: true
    })
    image: string;

    @Column({
        type: 'date',
        default: () => 'CURRENT_DATE'
    })
    created_on;
}