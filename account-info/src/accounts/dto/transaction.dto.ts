import { IsDefined, IsNumber, IsString } from "class-validator";

export class TransactionDto{
    @IsDefined()
    @IsString()
    credit_account_number: string;
    @IsDefined()
    @IsString()
    debit_account_number: string;
    @IsDefined()
    @IsNumber()
    amount: number;
}

export class SimpleTransactionDto{
    @IsDefined()
    @IsString()
    account_number: string;
    @IsDefined()
    @IsNumber()
    amount: number;
}
