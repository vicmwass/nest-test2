import { Entity, PrimaryGeneratedColumn,Column } from "typeorm";

@Entity()
export class Customers{
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    firstname: string;
    @Column()
    lastname: string;
    @Column()
    email: string;
    @Column({
        unique: true
    })
    username: string;
    @Column()
    password: string;
    @Column()
    accountNumber: string;
    @Column({
        default: 0
    })
    balance: number;
}

