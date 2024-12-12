import { Body, Controller, Post ,Get, Patch, Put, Param, Delete, HttpStatus, HttpException, Res} from "@nestjs/common";
import { TodosService } from "./todos.service";
import { TodosDto } from "./dto/todos.dto";
import {  Response } from 'express';

@Controller('todos')
export class TodosController{
    constructor(private readonly todosService:TodosService){}
    

    @Post()
    async create(@Res() response: Response,@Body() body:TodosDto){
    try{
        const todo= await this.todosService.createTodo(body)   
        return response.status(HttpStatus.CREATED).json({message:'Todo created successfully',data:todo});
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

    @Get()
    getAll(){
        return this.todosService.getAllTodos()
    }

    @Get(':id')
    async getTodo(@Res() response: Response,@Param('id') id:number){
        try{
        const todo= await this.todosService.getTodo(id)
        return response.status(HttpStatus.OK).json(todo);
        
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

    @Put(':id')
    async update(@Res() response:Response,@Param('id') id:number,@Body() body:TodosDto){

        try {
            const todo = await this.todosService.updateTodos(id,body)
            return response.status(HttpStatus.OK).json({
                message: 'Todo updated successfully',
                data: todo,
            });
            
            
        } catch (error ) {
            if (error instanceof HttpException) {
                const statusCode = error.getStatus();
                const errorMessage = error.message;    
                // Return custom error response
                return response.status(statusCode).json({message:errorMessage});                
            }    
            // Handle unexpected errors
            return response.status(HttpStatus.INTERNAL_SERVER_ERROR).send( 'An unexpected error occurred');            
        }   
    }  
    
    @Delete(':id')
    async delete(@Res() response:Response,@Param('id') id:number){
        try {
            await this.todosService.deleteTodos(id)    
            return response.status(HttpStatus.OK).json({message:'Todo deleted successfully'});

        } catch (error) {
            if (error instanceof HttpException) {
                const statusCode = error.getStatus();
                const errorMessage = error.message;    
                // Return custom error response
                return response.status(statusCode).json({message:errorMessage});                
            }    
            // Handle unexpected errors
            return response.status(HttpStatus.INTERNAL_SERVER_ERROR).send( 'An unexpected error occurred'); 
            
        }
        
    }  


}

