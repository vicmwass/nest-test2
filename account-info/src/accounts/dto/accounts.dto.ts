import { IsDefined, IsNumber, IsString } from "class-validator";

export class AccountsDto{
    @IsNumber()
    id: number;
    @IsNumber()
    account_holder_id: number;
    @IsString()
    account_holder_name: string;
    @IsString()
    account_number: string; 
    @IsNumber()
    balance: number;
}


export class CreateAccountsDto{
    @IsDefined()
    @IsNumber()
    account_holder_id: number;
    @IsDefined()
    @IsString()
    account_holder_name: string;
    @IsDefined()
    @IsString()
    account_number: string; 
   
}

export class AccountQueuePayloadDto{
    @IsDefined()
    @IsNumber()
    account_holder_id: number;
    @IsDefined()
    @IsString()
    account_holder_name: string;  
}