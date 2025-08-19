import { Channel } from 'amqplib';
import { inject, injectable } from 'tsyringe';
import { RabbitMQConfig } from '..';
import { RabbitMQQueueEnum } from '../enums/rabbitmq-queue.enum';
import { RabbitMQMessage } from '../interfaces';
import { RabbitMQConnectionService } from './rabbitMQ-connection.service';

interface ConsumeOptions {
  prefetch?: number;
  noAck?: boolean;
}

@injectable()
export class RabbitMQConsumeService {
  constructor(
    @inject(RabbitMQConnectionService) private connectionService: RabbitMQConnectionService,
  ) {}

  async consume<T>(
    queue: RabbitMQQueueEnum,
    handler: (data: T, message: RabbitMQMessage<T>) => Promise<void>,
    options: ConsumeOptions = {},
  ): Promise<void> {
    try {
      const channel = await this.connectionService.getChannel();

      // Configurar o prefetch específico para este consumidor
      // Se não fornecido, usa o valor padrão da configuração
      const prefetchCount = options.prefetch || RabbitMQConfig.prefetch;
      await channel.prefetch(prefetchCount);

      // Make sure queue exists
      await channel.assertQueue(queue, {
        durable: true,
      });

      console.log(`Starting to consume messages from queue: ${queue} (prefetch: ${prefetchCount})`);

      // Consume messages
      await channel.consume(
        queue,
        async (msg) => {
          if (!msg) return;

          try {
            const messageContent = msg.content.toString();
            const parsedMessage: RabbitMQMessage<T> = JSON.parse(messageContent);

            // Update attempt count
            parsedMessage.attempts = (parsedMessage.attempts || 0) + 1;

            console.log(
              `Processing message from queue ${queue}, ID: ${parsedMessage.id}, Attempt: ${parsedMessage.attempts}`,
            );

            try {
              // Execute handler
              await handler(parsedMessage.data, parsedMessage);

              // Acknowledge message if successful
              channel.ack(msg);
              console.log(`Message processed successfully: ${parsedMessage.id}`);
            } catch (error) {
              console.error(`Error processing message ${parsedMessage.id}:`, error);

              // Se excedeu o número máximo de tentativas, move para fila de dead-letter
              if (parsedMessage.attempts >= RabbitMQConfig.retryCount) {
                console.warn(
                  `Message ${parsedMessage.id} exceeded retry count (${RabbitMQConfig.retryCount}), moving to dead-letter queue`,
                );
                await this.sendToDeadLetterQueue(channel, queue, parsedMessage);
                channel.ack(msg); // Remove da fila original
              } else {
                // Recoloca a mensagem no final da fila após um atraso
                setTimeout(async () => {
                  try {
                    await channel.publish(
                      RabbitMQConfig.exchangeName,
                      queue,
                      Buffer.from(JSON.stringify(parsedMessage)),
                      { persistent: true },
                    );
                    // Remove a mensagem original
                    channel.ack(msg);
                  } catch (e) {
                    console.error(`Failed to requeue message ${parsedMessage.id}:`, e);
                    channel.nack(msg, false, true); // Requeued the original message
                  }
                }, RabbitMQConfig.retryDelay);
              }
            }
          } catch (parseError) {
            console.error(`Failed to parse message:`, parseError);
            // Can't process this message, acknowledge it to remove from queue
            channel.ack(msg);
          }
        },
        {
          noAck: options.noAck || false, // Manual acknowledgment
        },
      );
    } catch (error) {
      console.error(`Error setting up consumer for queue ${queue}:`, error);
      throw error;
    }
  }

  private async sendToDeadLetterQueue<T>(
    channel: Channel,
    sourceQueue: string,
    message: RabbitMQMessage<T>,
  ): Promise<void> {
    const deadLetterQueue = `${sourceQueue}.dead-letter`;

    // Ensure dead-letter queue exists
    await channel.assertQueue(deadLetterQueue, {
      durable: true,
    });

    // Send to dead-letter queue
    await channel.publish(
      '',
      deadLetterQueue,
      Buffer.from(
        JSON.stringify({
          ...message,
          error: 'Exceeded retry count',
          failedAt: new Date(),
        }),
      ),
      {
        persistent: true,
        contentType: 'application/json',
      },
    );

    console.log(`Message ${message.id} sent to dead-letter queue: ${deadLetterQueue}`);
  }
}
