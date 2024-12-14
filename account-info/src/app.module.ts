import { Inject, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Todos } from './todos/todos.entity';
import { TodosModule } from './todos/todos.module';
import { AccountsModule } from './accounts/accounts.module';
import { join } from 'path';
import { Accounts } from './accounts/entity/accounts.entity';
import { Transactions } from './accounts/entity/transaction.entity';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';


@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports:[ConfigModule],
      useFactory: (configService:ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST'),
        port: +configService.get<Number>('DB_PORT'),
        username: configService.get('DB_USER'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        entities: [Accounts,Transactions],
        synchronize: true,
      }),
      inject:[ConfigService]//inject and init dependencies into factory
    }),    
    // TodosModule,
    AccountsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
