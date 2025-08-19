import { config } from 'dotenv';
config();

export const RabbitMQConfig = {
  url: `amqp://${process.env.RABBITMQ_USER}:${process.env.RABBITMQ_PASSWORD}@${process.env.RABBITMQ_HOST}:${process.env.RABBITMQ_PORT}`,
  exchangeName: process.env.RABBITMQ_EXCHANGE || 'app_exchange',
  retryCount: parseInt(process.env.RABBITMQ_RETRY_COUNT || '5', 10),
  retryDelay: parseInt(process.env.RABBITMQ_RETRY_DELAY || '5000', 10),
  prefetch: parseInt(process.env.RABBITMQ_PREFETCH || '10', 10),
};
