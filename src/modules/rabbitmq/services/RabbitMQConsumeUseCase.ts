import { inject, injectable } from 'tsyringe';
import { AppException } from '../../../shared/exceptions';
import { RabbitMQQueueEnum } from '../enums/rabbitmq-queue.enum';
import { RabbitMQConsumeService } from './rabbitMQ-consume.service';

@injectable()
export class RabbitMQConsumeUseCase {
  constructor(@inject(RabbitMQConsumeService) private consumeService: RabbitMQConsumeService) {}

  async consumeUserCreatedMessages(): Promise<void> {
    // Configurar para processar apenas 1 mensagem por vez
    const options = { prefetch: 1 };

    await this.consumeService.consume<{ parent: string }>(
      RabbitMQQueueEnum.REQUEST_COMPLETED,
      async (data) => {
        try {
          console.log(`Processing user created message for user ID: ${data.parent}`);
          // Implement your business logic here
          // For example:
          // await this.emailService.sendWelcomeEmail(data.email);

          console.log(`Successfully processed user created message for user ID: ${data.parent}`);
          if (data.parent !== '667788') {
            throw new AppException(`Simulated error for testing: ${data.parent}`);
          }
        } catch (error) {
          console.error(`Failed to process user created message:`, error);
          throw error; // Rethrow to trigger requeue
        }
      },
      options, // Passar as opções para o método consume
    );
  }
}
