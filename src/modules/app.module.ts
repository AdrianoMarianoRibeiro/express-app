import { AppController } from '../controllers/app.controller';
import { Module } from '../decorators/module.decorator';
import { UserModule } from './user/user.module';

@Module({
  imports: [UserModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
