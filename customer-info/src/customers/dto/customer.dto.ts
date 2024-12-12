import { IsDefined, IsNumber, IsString } from "class-validator";

export class CustomerDto{
    @IsNumber()
    id: number;
    @IsString()
    username: string;
    @IsString()
    password: string;
    @IsString()
    firstname: string;
    @IsString()
    lastname: string;
    @IsString()
    email: string;
}

export class CreateCustomerDto {
    @IsDefined()
    @IsString()
    username: string;
    @IsDefined()
    @IsString()
    password: string;
    @IsDefined()
    @IsString()
    firstname: string;
    @IsDefined()
    @IsString()
    lastname: string;
    @IsDefined()
    @IsString()
    email: string;
}