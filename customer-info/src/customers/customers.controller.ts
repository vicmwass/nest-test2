import { Body, Controller, Post ,Get, Patch, Put, Param, Delete, HttpStatus, HttpException, Res} from "@nestjs/common";
import { CustomersService } from "./customers.service";
import {  Response } from 'express';
import { CustomerDto } from "./dto/customer.dto";

@Controller('customers')
export class CustomersController{
    constructor(private readonly customersService: CustomersService){}
    @Get()
    getAllCustomers(@Res() response: Response,){
        try{    
            const customers = this.customersService.getCustomers();
            return response.status(HttpStatus.OK).json(customers);
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
    addCustomer(@Res() response: Response,@Body() completeBody){
        try{
            const customer = this.customersService.createCustomer(completeBody);
            return response.status(HttpStatus.CREATED).json(customer);
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
    @Get(':id')
    async getCustomer(@Res() response: Response,@Param('id') id: number){
        try{
            const customer= await this.customersService.getCustomerById(id)
            return response.status(HttpStatus.OK).json(customer);
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
    @Get(':username')
    async getCustomerByUsername(@Res() response: Response,@Param('username') username: string){
        try{
            const customer= await this.customersService.getCustomerByUsername(username)
            return response.status(HttpStatus.OK).json(customer);
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

    @Put(':id')
    async updateCustomer(@Res() response: Response, @Param('id') id: number, @Body() completeBody:CustomerDto){
        try{
            const customer = await this.customersService.updateCustomer(id, completeBody);
            return response.status(HttpStatus.OK).json(customer);
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
    @Delete(':id')
    async deleteCustomer(@Res() response: Response, @Param('id') id: number){
        try{
            await this.customersService.deleteCustomer(id);
            return response.status(HttpStatus.OK)
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