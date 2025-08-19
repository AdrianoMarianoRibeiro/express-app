import { AppController } from '../controllers/app.controller';
import { Module } from '../decorators/module.decorator';
import { AuthModule } from './auth/auth.module';
import { PostModule } from './post/post.module';
import { RabbitMQModule } from './rabbitmq/rabbitmq.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [AuthModule, UserModule, PostModule, RabbitMQModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
