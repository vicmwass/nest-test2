import { IsDefined, IsNumber, IsString } from "class-validator";

export class TodosDto{
    @IsNumber()
    id: number;
    @IsString()
    title:string;
    @IsString()
    description:string;
    @IsString()
    status:string;
}