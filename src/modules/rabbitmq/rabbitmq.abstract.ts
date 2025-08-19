import { RabbitMQQueueEnum } from './enums/rabbitmq-queue.enum';

export abstract class RabbitMQAbstract {
  public static QUEUES: string[] = Object.values(RabbitMQQueueEnum);
}
