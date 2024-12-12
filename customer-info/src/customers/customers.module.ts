import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CustomersService } from "./customers.service";
import { CustomersController } from "./customers.controller";
import { Customers } from "./entity/customers.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Customers])],
    controllers: [CustomersController],
    providers: [CustomersService]
})
export class CustomersModule{}