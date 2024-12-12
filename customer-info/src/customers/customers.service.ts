import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Customers } from "./entity/customers.entity";
import { CustomerDto } from "./dto/customer.dto";


@Injectable()
export class CustomersService{
    constructor(
        @InjectRepository(Customers)
        private customersRepository: Repository<Customers>,
      ) {}

    async createCustomer(data: CustomerDto){    
        try{
            const todo=this.customersRepository.create(data);        
            return await this.customersRepository.save(todo);
        }catch(err){
            throw new HttpException("Couldn't create the customer,try again later", HttpStatus.INTERNAL_SERVER_ERROR);
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