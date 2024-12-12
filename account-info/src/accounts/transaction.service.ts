import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Accounts } from "./entity/accounts.entity";
import { AccountsDto,CreateAccountsDto } from "./dto/accounts.dto";
import { Transactions } from "./entity/transaction.entity";
import { TransactionDto } from "./dto/transaction.dto";
import { AccountsService } from "./accounts.service";



@Injectable()
export class TransactionsService{
    constructor(
        @InjectRepository(Transactions)
        private transactionsRepository: Repository<Transactions>,
        private readonly accountsService:AccountsService
    ){}

    async getTransactions() {
        return this.transactionsRepository.find();
    }

    async addTransaction(transaction:TransactionDto) {        
        try{
            const creditAccount=await this.accountsService.getAccountByAccountNumber(transaction.credit_account_number)
            const debitAccount=await this.accountsService.getAccountByAccountNumber(transaction.debit_account_number)
            if(!creditAccount){
                throw new HttpException(`Account ${transaction.credit_account_number} does not exist`, HttpStatus.BAD_REQUEST);
            }
            if(!debitAccount){
                throw new HttpException(`Account ${transaction.debit_account_number} does not exist`, HttpStatus.BAD_REQUEST);
            }
            if(creditAccount.balance>transaction.amount){
                await this.accountsService.updateAccountBalance(creditAccount.id,transaction.amount,false);
                await this.accountsService.updateAccountBalance(debitAccount.id,transaction.amount,true);
                const data=this.transactionsRepository.create(transaction);        
                return this.transactionsRepository.save(data);
            }
            else{
                throw new HttpException(`Insufficient balance for account ${creditAccount.account_number}`, HttpStatus.BAD_REQUEST);
            }
        }catch(error){
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException('Could not perform the transaction', HttpStatus.INTERNAL_SERVER_ERROR);
        }

                
    }
}