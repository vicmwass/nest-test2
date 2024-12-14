import { IsDefined, IsNumber, IsString,IsOptional } from "class-validator";

export class CustomerDto{
    @IsOptional()
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

export class UpdateAccNoPayloadDto{
    @IsDefined()
    @IsString()
    account_number: string;
    @IsDefined()
    @IsNumber()
    account_holder_id: number;
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