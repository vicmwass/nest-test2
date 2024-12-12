import { Entity, PrimaryGeneratedColumn,Column } from "typeorm";

@Entity()
export class Todos{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    description: string;

    @Column({default: "pending"})
    status: string;
}
 