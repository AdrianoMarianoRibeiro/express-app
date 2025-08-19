import { Module } from '../../decorators';
import { RabbitMQConnectionService } from './services/rabbitMQ-connection.service';
import { RabbitMQConsumeService } from './services/rabbitMQ-consume.service';
import { RabbitMQPublishService } from './services/rabbitMQ-publish.service';

@Module({
  providers: [RabbitMQConnectionService, RabbitMQPublishService, RabbitMQConsumeService],
  exports: [RabbitMQPublishService, RabbitMQConsumeService],
})
export class RabbitMQModule {}
