import { inject, injectable } from 'tsyringe';
import { v4 as uuidv4 } from 'uuid';
import { RabbitMQConfig } from '..';
import { RabbitMQQueueEnum } from '../enums/rabbitmq-queue.enum';
import { RabbitMQMessage } from '../interfaces';
import { RabbitMQConnectionService } from './rabbitMQ-connection.service';

@injectable()
export class RabbitMQPublishService {
  constructor(
    @inject(RabbitMQConnectionService) private connectionService: RabbitMQConnectionService,
  ) {}

  async setupQueue(queueName: RabbitMQQueueEnum): Promise<void> {
    try {
      const channel = await this.connectionService.getChannel();

      // Declare queue
      await channel.assertQueue(queueName, {
        durable: true, // Queue survives broker restart
      });

      // Bind queue to exchange
      await channel.bindQueue(queueName, RabbitMQConfig.exchangeName, queueName);

      console.log(`Queue ${queueName} setup completed`);
    } catch (error) {
      console.error(`Failed to setup queue ${queueName}:`, error);
      throw error;
    }
  }

  async publish<T>(queue: RabbitMQQueueEnum, data: T): Promise<void> {
    try {
      const channel = await this.connectionService.getChannel();

      // Ensure queue exists
      await this.setupQueue(queue);

      // Create message with unique ID
      const message: RabbitMQMessage<T> = {
        id: uuidv4(),
        data,
        timestamp: new Date(),
        attempts: 0,
      };

      // Publish to exchange with routing key same as queue name
      const success = channel.publish(
        RabbitMQConfig.exchangeName,
        queue,
        Buffer.from(JSON.stringify(message)),
        {
          persistent: true, // Message survives broker restart
          contentType: 'application/json',
        },
      );

      if (!success) {
        throw new Error(`Failed to publish message to queue ${queue}`);
      }

      console.log(`Message published to queue ${queue} with ID: ${message.id}`);
    } catch (error) {
      console.error(`Error publishing to queue ${queue}:`, error);
      throw error;
    }
  }
}
