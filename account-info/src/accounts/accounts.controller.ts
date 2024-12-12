import { Controller, Get,Post,Res,Body,HttpException, HttpStatus,Param} from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { Response } from 'express';
import { AccountsDto } from './dto/accounts.dto';
import { SimpleTransactionDto, TransactionDto } from './dto/transaction.dto';
import { TransactionsService } from './transaction.service';

@Controller('accounts')
export class AccountsController {
    constructor(
        private readonly accountsService:AccountsService,
        private readonly transactionsService:TransactionsService
    ){}

    @Get()
    async getAccounts(@Res() response: Response) {
        try{
            const accounts= await this.accountsService.getAccounts();
            return response.status(HttpStatus.OK).json(accounts);
        }catch(error){
            if (error instanceof HttpException) {            
                const statusCode = error.getStatus();
                const errorMessage = error.message;    
                return response.status(statusCode).json({message:errorMessage});                
            }    
            // Handle unexpected errors
            return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message:'An unexpected error occurred'});                

        }
        
    }

    @Post()
    async createAccount(@Res() response: Response,@Body() body:AccountsDto){
    try{
        const account= await this.accountsService.createAccounts(body)
        return response.status(HttpStatus.CREATED).json({message:'Account created successfully',data:account});
    }catch(error){
        if (error instanceof HttpException) {            
            const statusCode = error.getStatus();
            const errorMessage = error.message;    
            return response.status(statusCode).json({message:errorMessage});                
        }    
        // Handle unexpected errors
        return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message:'An unexpected error occurred'});            
    }

    }

    @Get('account_number/:account_number')
    async getAccountByAccountNumber(@Res() response: Response,@Param('account_number') account_number:string){
        try{
        const account= await this.accountsService.getAccountByAccountNumber(account_number)
        return response.status(HttpStatus.OK).json(account);
        
        } catch (error ) {
            if (error instanceof HttpException) {
                const statusCode = error.getStatus();
                const errorMessage = error.message;    
                return response.status(statusCode).json({message:errorMessage});                
            }    
            // Handle unexpected errors
            return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message:'An unexpected error occurred'});            
        }
    }

    @Get('account_holder/:account_holder_id')
    async getAccountByHolderId(@Res() response: Response,@Param('account_holder_id') account_holder_id:number){
        try{
        const account= await this.accountsService.getAccountByHolderId(account_holder_id)
        return response.status(HttpStatus.OK).json(account);
        
        } catch (error ) {
            if (error instanceof HttpException) {
                const statusCode = error.getStatus();
                const errorMessage = error.message;    
                return response.status(statusCode).json({message:errorMessage});                
            }    
            // Handle unexpected errors
            return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message:'An unexpected error occurred'});            
        }
    }
    @Post('deposit')
    async makeDeposit(@Res() response:Response,@Body() body:SimpleTransactionDto){
        try{
            await this.accountsService.makeDeposit(body)
            return response.status(HttpStatus.OK).json({message:'Deposit completed successfully'});
        }catch(error){
            if (error instanceof HttpException) {
                const statusCode = error.getStatus();
                const errorMessage = error.message;
                return response.status(statusCode).json({message:errorMessage});
            }
            // Handle unexpected errors
            return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message:'An unexpected error occurred'});
        }
    }

    @Post('withdraw')
    async makeWithdrawal(@Res() response:Response, @Body() body:SimpleTransactionDto){
        try{
            await this.accountsService.makeWithdrawal(body)
            return response.status(HttpStatus.OK).json({message:'Withdrawal completed successfully'});
        }catch(error){
            if (error instanceof HttpException) {
                const statusCode = error.getStatus();
                const errorMessage = error.message;
                return response.status(statusCode).json({message:errorMessage});
            }
            // Handle unexpected errors
            return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message:'An unexpected error occurred'});
        }
    }

    @Post('make_transaction')
    async transaction(@Res() response: Response, @Body() body:TransactionDto){
        try{
            await this.transactionsService.addTransaction(body)
            return response.status(HttpStatus.OK).json({message:'Transaction completed successfully'});
        }catch(error){
            if (error instanceof HttpException) {
                const statusCode = error.getStatus();
                const errorMessage = error.message;
                return response.status(statusCode).json({message:errorMessage});
            }
            // Handle unexpected errors
            return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message:'An unexpected error occurred'});
        }
    }



}