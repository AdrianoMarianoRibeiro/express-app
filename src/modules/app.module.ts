import { AppController } from '../controllers/app.controller';
import { Module } from '../decorators/module.decorator';
import { PostModule } from './post/post.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [UserModule, PostModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
