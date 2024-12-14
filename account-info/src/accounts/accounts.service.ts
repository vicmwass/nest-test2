import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Accounts } from "./entity/accounts.entity";
import { AccountQueuePayloadDto, AccountsDto,CreateAccountsDto } from "./dto/accounts.dto";
import { SimpleTransactionDto } from "./dto/transaction.dto";
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq'



@Injectable()
export class AccountsService{
    constructor(
        @InjectRepository(Accounts)
        private accountsRepository: Repository<Accounts>,
        private readonly amqpConnection: AmqpConnection
      ) {}

      @RabbitSubscribe({ 
        exchange: 'exchange1',
         routingKey: 'message-accounts.create-account',
        queue: 'message-accounts', })
    async createAccountFromQueue({data}) {
        try{
        const account:CreateAccountsDto={
            account_holder_id:data.account_holder_id,
            account_number:this.generateAccountNumber(),
            account_holder_name:data.account_holder_name,        
        }
           await this.createAccounts(account);
           try{
            await this.amqpConnection.publish('exchange1',
                'message-customers.update-account',
                 { data: {
                   account_holder_id:data.account_holder_id,
                   account_number:account.account_number
                 }, });
           }catch(error){
            console.log('could not send update customer to queue'+(error.message));
           }
          
        }catch(error){
           console.log('could not create account from queue'+(error.message));
        }
        
    }
    
    generateAccountNumber(){
        return '11009'+(Math.floor(Math.random() * 90000) + 10000);
    }
    

    async createAccounts(data: CreateAccountsDto){
        try{
            const checkAccount:AccountsDto=await this.accountsRepository.findOne({where:{account_number:data.account_number}});
            if(checkAccount){
                throw new HttpException('Account number already exists', HttpStatus.BAD_REQUEST);
            }
            const account=this.accountsRepository.create(data);        
            return await this.accountsRepository.save(account);
        }catch(error){
            if(error instanceof HttpException){
                throw error;
            }else{
                throw new HttpException('Problem creating account, try again later' +(error.message), HttpStatus.INTERNAL_SERVER_ERROR);;
            }
        }
        
    }

    async getAccounts(){
        return await this.accountsRepository.find();
    }

    
    async getAccountByHolderId(id:number){   
        try{
            const account:AccountsDto=await this.accountsRepository.findOne({where:{account_holder_id:id}});
        if(!account){
        throw new HttpException('Account not found', HttpStatus.NOT_FOUND);
        }
        return account;

        }catch(error){
            throw new HttpException('Problem getting account, try again later', HttpStatus.INTERNAL_SERVER_ERROR);
        }  
        
    }

    async getAccountByAccountNumber(account_number:string){  
        try{
            const account:AccountsDto=await this.accountsRepository.findOne({where:{account_number}});
            if(!account){
            throw new HttpException('Account not found', HttpStatus.NOT_FOUND);
            }
            return account;
        }  catch(error){
            if(error instanceof HttpException){
                throw error;
            }
            throw new HttpException('Problem getting account, try again later', HttpStatus.INTERNAL_SERVER_ERROR);
        }   
       
    }

    async updateAccountBalance(id:number,amount: number,isAddition:boolean){
        try{
            const account:AccountsDto=await this.accountsRepository.findOne({where:{id:id}});
        // Check if account exists
        if (!account) {
            throw new HttpException('Account not found', HttpStatus.NOT_FOUND);
        }    
        const account_number=account.account_number
        if(isAddition){
            account.balance+=amount;
        }else{
            if(account.balance<amount){
                throw new HttpException(`Insufficient balance in account ${account_number}`, HttpStatus.BAD_REQUEST);
            }
            account.balance-=amount;
        }
            await this.accountsRepository.save(account);
            try{
                console.log('sending update customer balance to queue')
                await this.amqpConnection.publish('exchange1',
                    'message-customers.update-balance',
                     { data: {
                       account_holder_id:account.account_holder_id,
                       account_number:account.account_number,
                       amount,
                       isAddition
                     }, });
            }catch(error){
                console.log('could not send update customer balance to queue'+(error.message));
            }
            
            return account
            
        }catch(error){
            if(error instanceof HttpException){
                throw error;
            }
            throw new HttpException('Problem updating account balance, try again later', HttpStatus.INTERNAL_SERVER_ERROR);
        }
        
        }
    
        async deleteAccounts(id:number){
            try{
                const account:AccountsDto=await this.accountsRepository.findOne({where:{id:id}});
            if (!account) {
                throw new HttpException('Account not found', HttpStatus.NOT_FOUND);
            }
            return await this.accountsRepository.delete(account);

            }catch(error){
                if(error instanceof HttpException){
                    throw error;
                }
                throw new HttpException('Problem deleting account, try again later', HttpStatus.INTERNAL_SERVER_ERROR);
            }
            
        }

        async makeWithdrawal(data:SimpleTransactionDto){
            try{
                if(data.amount<=0){
                    throw new HttpException('Amount must be greater than 0', HttpStatus.BAD_REQUEST);
                }
                const {account_number,amount}=data
                const account:AccountsDto=await this.accountsRepository.findOne({where:{account_number}});
                if (!account) {
                    throw new HttpException('Account not found', HttpStatus.NOT_FOUND);
                }
                if(account.balance<amount){
                    throw new HttpException(`Insufficient balance in account ${account_number}`, HttpStatus.BAD_REQUEST);
                }
                account.balance-=amount;
                await this.accountsRepository.save(account);
                try{
                    console.log('sending update customer balance to queue')
                    await this.amqpConnection.publish('exchange1',
                        'message-customers.update-balance',
                         { data: {
                           account_holder_id:account.account_holder_id,
                           account_number:account.account_number,
                           amount,
                           isAddition:false
                         }, });
                }catch(error){
                    console.log('could not send update customer balance to queue'+(error.message));
                }
                return account
            }catch(error){
                if(error instanceof HttpException){
                    throw error;
                }
                throw new HttpException('Problem making withdrawal, try again later', HttpStatus.INTERNAL_SERVER_ERROR);
            }
            
        }

        async makeDeposit(data:SimpleTransactionDto){
            try{
                if(data.amount<=0){
                    throw new HttpException('Amount must be greater than 0', HttpStatus.BAD_REQUEST);
                }
                const {account_number,amount}=data
                const account:AccountsDto=await this.accountsRepository.findOne({where:{account_number}});
                if (!account) {
                    throw new HttpException('Account not found', HttpStatus.NOT_FOUND);
                }
                account.balance+=amount;
                await this.accountsRepository.save(account);
                try{
                    console.log('sending update customer balance to queue')
                    await this.amqpConnection.publish('exchange1',
                        'message-customers.update-balance',
                         { data: {
                           account_holder_id:account.account_holder_id,
                           account_number:account.account_number,
                           amount,
                           isAddition:true
                         }, });
                }catch(error){
                    console.log('could not send update customer balance to queue'+(error.message));
                }
                return account
            }catch(error){
                if(error instanceof HttpException){
                    throw error;
                }
                throw new HttpException('Problem making deposit, try again later', HttpStatus.INTERNAL_SERVER_ERROR);
            }
           
        }

}