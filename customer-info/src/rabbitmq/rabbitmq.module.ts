import { Module } from '@nestjs/common';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
@Module({
  imports: [
      RabbitMQModule.forRoot(
        RabbitMQModule, {
           exchanges: [ {
             name: 'exchange1',
              type: 'topic', }, 
            ],
            queues: [ {
              name: 'message-customers',
              options: {
                  durable: true,
                }
             }],
            uri: 'amqp://user:password@localhost:5672', }),
  ],
  exports: [RabbitMQModule],
})
export class RabbitMQSharedModule {}
