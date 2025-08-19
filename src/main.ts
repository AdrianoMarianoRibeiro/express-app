import { config } from 'dotenv';
import 'reflect-metadata';

// Carrega as variáveis de ambiente PRIMEIRO
config();

// Configurar timezone para o Brasil
process.env.TZ = 'America/Sao_Paulo';

import { container } from 'tsyringe';
import { ExpressApplication } from './core/application';
import AppDataSource from './database/database.config';
import { AppModule } from './modules/app.module';
import { RabbitMQConnectionService } from './modules/rabbitmq/services/rabbitMQ-connection.service';
import { RabbitMQConsumeUseCase } from './modules/rabbitmq/services/RabbitMQConsumeUseCase';

async function bootstrap() {
  const app = new ExpressApplication();

  try {
    await app.bootstrap(AppModule, AppDataSource);

    // Iniciar conexão com RabbitMQ
    const rabbitMQConnection = container.resolve(RabbitMQConnectionService);
    await rabbitMQConnection.connect();

    // Iniciar consumers
    const rabbitMQConsume = container.resolve(RabbitMQConsumeUseCase);
    await rabbitMQConsume.consumeUserCreatedMessages();

    const port = parseInt(process.env.PORT || '3000');

    app.listen(port);

    console.log(`🚀 Application is running on: http://localhost:${port}`);
    console.log(`📚 Swagger docs available at: http://localhost:${port}/api-docs`);
    console.log(`⏰ Server timezone: ${Intl.DateTimeFormat().resolvedOptions().timeZone}`);
    console.log(
      `🕐 Current time: ${new Date().toLocaleString('pt-BR', {
        timeZone: 'America/Sao_Paulo',
      })}`,
    );
  } catch (error) {
    console.error('Failed to start application:', error);
    process.exit(1);
  }

  // Gerenciar desligamento correto
  process.on('SIGINT', async () => {
    console.log('Application shutting down...');
    const rabbitMQConnection = container.resolve(RabbitMQConnectionService);
    await rabbitMQConnection.closeConnection();
    process.exit(0);
  });
}

bootstrap();
