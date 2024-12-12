import { Entity, PrimaryGeneratedColumn,Column } from "typeorm";

@Entity()
export class Transactions{
    @PrimaryGeneratedColumn()
    transaction_id: number;
    @Column()
    amount:number
    @Column()
    debit_account_number:string
    @Column()
    credit_account_number:string
}
