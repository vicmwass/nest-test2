import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Customers } from "./entity/customers.entity";
import { CustomerDto,CreateCustomerDto, UpdateAccNoPayloadDto } from "./dto/customer.dto";
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq'
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';


@Injectable()
export class CustomersService{
    constructor(
        @InjectRepository(Customers)
        private customersRepository: Repository<Customers>,
        private readonly amqpConnection: AmqpConnection
      ) {}

      @RabbitSubscribe({ 
        exchange: 'exchange1',
         routingKey: 'message-customers.update-account',
        queue: 'message-customers', })
    async updateAccountNumberOnCreate({data}){
        try{
            const customer=await this.customersRepository.findOne({where:{id:data.account_holder_id}});
            if(customer){
                customer.accountNumber=data.account_number;
                await this.customersRepository.save(customer);
            }
        }catch(err){
            console.log(err.message)
        }

    }

    @RabbitSubscribe({ 
        exchange: 'exchange1',
         routingKey: 'message-customers.update-balance',
        queue: 'message-customers', })
    async updateAmountBalance({data}){
        try{
            const customer=await this.customersRepository.findOne({where:{id:data.account_holder_id}});
            if(customer){
                console.log(data)
                if (data.isAddition){
                    customer.balance+=data.amount;
                }else{
                    customer.balance-=data.amount;
                }
                await this.customersRepository.save(customer);
            }
        }catch(err){
            console.log(err.message)
        }

    }

    async createCustomer(data: CreateCustomerDto){    
        try{
            // console.log(data)
            const customer=this.customersRepository.create(data);        
            await this.customersRepository.save(customer);
            try{
                await this.amqpConnection.publish('exchange1',
                    'message-accounts.create-account',
                     { data: {
                       account_holder_id:customer.id,
                       account_number:customer.accountNumber,
                       account_holder_name:customer.username
                     }, });
            }catch(err){
                console.log(err.message)
            }            
            return customer;
        }catch(err){
            console.log(err.message)
            throw new HttpException("Couldn't create the customer,try again later: "+(err.message), HttpStatus.INTERNAL_SERVER_ERROR);
        }
        
    }

    async getCustomers(){
        return await this.customersRepository.find();
    }

    async getCustomerById(id: number){
        try{
            const customer=await this.customersRepository.findOne({where:{id}});
        if(customer){
            return customer;
        }
        throw new HttpException('Customer not found', HttpStatus.NOT_FOUND);
        }catch(err){
            if(err instanceof HttpException){
                throw err;
            }
            throw new HttpException("Couldn't get the customer, try again later", HttpStatus.INTERNAL_SERVER_ERROR);
        }
        
    }
    async getCustomerByUsername(username: string){
        try{
            const customer=await this.customersRepository.findOne({where:{username}});
            if(customer){
                return customer;
            }
            throw new HttpException('Customer not found', HttpStatus.NOT_FOUND);

        }catch(err){
            if(err instanceof HttpException){
                throw err;
            }
            throw new HttpException("Couldn't get the customer, try again later", HttpStatus.INTERNAL_SERVER_ERROR);
        }
       
    }

    async updateCustomer(id: number, data: CustomerDto){
        try{
            const customer=await this.customersRepository.findOne({where:{id}});
            if(customer){
                Object.assign(customer,data);
                return await this.customersRepository.save(customer);
            }
        throw new HttpException('Customer not found', HttpStatus.NOT_FOUND);
        }catch(error){
            if(error instanceof HttpException){
                throw error;
            }
            throw new HttpException("Couldn't update the customer, try again later", HttpStatus.INTERNAL_SERVER_ERROR);
        }
        
    }

    // async deleteCustomer(id: number){
    //     const deleted=await this.customersRepository.delete(id);
    //     if(!deleted.affected){
    //         throw new HttpException('Customer not found', HttpStatus.NOT_FOUND);
    //     }
    // }
    async deleteCustomer(id: number){
        try{
            const customer=await this.customersRepository.findOne({where:{id}});
            if(customer){
                throw new HttpException('Customer not found', HttpStatus.NOT_FOUND);
            }
            return await this.customersRepository.delete(customer);
        }catch(err){
            if(err instanceof HttpException){
                throw err;
            }
            throw new HttpException("Couldn't delete the customer, try again later", HttpStatus.INTERNAL_SERVER_ERROR);
        }
        
    }

}