import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Accounts } from "./entity/accounts.entity";
import { AccountsController } from "./accounts.controller"
import { AccountsService } from "./accounts.service";
import { Transactions } from "./entity/transaction.entity";
import { TransactionsService } from "./transaction.service";
import { RabbitMQSharedModule } from "src/rabbitmq/rabbitmq.module";

@Module({
    imports: [TypeOrmModule.forFeature([Accounts,Transactions]),RabbitMQSharedModule],
    controllers: [AccountsController],
    providers: [AccountsService,TransactionsService]
})
export class AccountsModule{}