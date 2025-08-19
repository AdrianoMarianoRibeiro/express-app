export interface RabbitMQMessage<T = any> {
  id: string;
  data: T;
  timestamp: Date;
  attempts?: number;
}
