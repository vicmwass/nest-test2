import { Entity, PrimaryGeneratedColumn,Column } from "typeorm";

@Entity()
export class Accounts{
    @PrimaryGeneratedColumn()
    id: number;
    @Column({
        nullable: false,
    })
    account_holder_id: number;
    @Column({
        nullable: false,
        default: 0,
        type: "float",
    })
    balance: number;
    @Column({
        nullable: false,
    })
    account_holder_name: string;
    @Column({
        nullable: false,
    })
    account_number: string;

}