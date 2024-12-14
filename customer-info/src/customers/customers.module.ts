import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CustomersService } from "./customers.service";
import { CustomersController } from "./customers.controller";
import { Customers } from "./entity/customers.entity";
import { RabbitMQSharedModule } from "src/rabbitmq/rabbitmq.module";

@Module({
    imports: [TypeOrmModule.forFeature([Customers]),RabbitMQSharedModule],
    controllers: [CustomersController],
    providers: [CustomersService]
})
export class CustomersModule{}