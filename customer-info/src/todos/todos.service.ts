import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Todos } from "./todos.entity";
import { Repository } from "typeorm";
import { TodosDto } from "./dto/todos.dto";

@Injectable()
export class TodosService{
   
    constructor(
        @InjectRepository(Todos)
        private todosRepository: Repository<Todos>,
      ) {}

    async createTodo(data: TodosDto){
        if(!data.description||!data.title){
            throw new HttpException('Title and description are required', HttpStatus.BAD_REQUEST);
        }
        const todo=this.todosRepository.create(data);        
        return await this.todosRepository.save(todo);
    }

    async getAllTodos(){
        return await this.todosRepository.find();
    }

    async getTodo(id:number){        
        const todo=await this.todosRepository.findOne({where:{id:id}});
        if(!todo){
        throw new HttpException('Todo not found', HttpStatus.NOT_FOUND);
        }
        return todo;
    }

    async updateTodos(id:number,data: TodosDto){
    const todo=await this.todosRepository.findOne({where:{id:id}});
    // Check if todo exists
    if (!todo) {
        throw new HttpException('Todo not found', HttpStatus.NOT_FOUND);
    }    
        Object.assign(todo,data);
        return await this.todosRepository.save(todo);
    }

    async deleteTodos(id:number){
        const todo=await this.todosRepository.findOne({where:{id:id}});
        if (!todo) {
            throw new HttpException('Todo not found', HttpStatus.NOT_FOUND);
        }
        return await this.todosRepository.delete(todo);
    }


}
