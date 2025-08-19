import * as amqplib from 'amqplib';
import { injectable } from 'tsyringe';
import { RabbitMQConfig } from '..';

@injectable()
export class RabbitMQConnectionService {
  private connection: amqplib.Connection | null = null;
  private channel: amqplib.Channel | null = null;

  async connect(): Promise<void> {
    try {
      // Use "as any" para contornar o problema de tipos
      this.connection = await (amqplib.connect(
        RabbitMQConfig.url,
      ) as unknown as Promise<amqplib.Connection>);

      // Forçar o tipo correto para o channel
      this.channel = await (this.connection as any).createChannel();

      // Configure prefetch to control how many messages are sent to this consumer at once
      if (this.channel) {
        await this.channel.prefetch(RabbitMQConfig.prefetch);

        // Create exchange
        await this.channel.assertExchange(RabbitMQConfig.exchangeName, 'direct', { durable: true });
      }

      console.log('🐰 RabbitMQ connection established');

      // Handle connection errors and reconnection
      if (this.connection) {
        this.connection.on('error', (err) => {
          console.error('RabbitMQ connection error:', err);
          this.reconnect();
        });

        this.connection.on('close', () => {
          console.warn('RabbitMQ connection closed, attempting to reconnect...');
          this.reconnect();
        });
      }
    } catch (error) {
      console.error('Failed to connect to RabbitMQ:', error);
      // Attempt to reconnect after delay
      setTimeout(() => this.reconnect(), 5000);
    }
  }

  private async reconnect(): Promise<void> {
    try {
      // Clean up existing connection
      if (this.channel) {
        try {
          await this.channel.close();
        } catch (e: any) {
          // Ignore errors when closing
          e();
        }
      }

      if (this.connection) {
        try {
          await (this.connection as any).close();
        } catch (e: any) {
          // Ignore errors when closing
          e();
        }
      }

      this.channel = null;
      this.connection = null;

      // Attempt to reconnect
      setTimeout(() => this.connect(), 5000);
    } catch (error) {
      console.error('Error during reconnection:', error);
      setTimeout(() => this.reconnect(), 5000);
    }
  }

  async getChannel(): Promise<amqplib.Channel> {
    if (!this.channel) {
      await this.connect();
    }

    if (!this.channel) {
      throw new Error('Could not establish RabbitMQ channel');
    }

    return this.channel;
  }

  async closeConnection(): Promise<void> {
    try {
      if (this.channel) {
        await this.channel.close();
      }

      if (this.connection) {
        await (this.connection as any).close();
      }

      this.channel = null;
      this.connection = null;
      console.log('RabbitMQ connection closed');
    } catch (error) {
      console.error('Error closing RabbitMQ connection:', error);
    }
  }
}
