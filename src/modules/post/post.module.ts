import { Module } from '../../decorators';
import { UserModule } from '../user/user.module';
import { PostController } from './post.controller';
import { PostRepository } from './post.repository';
import { PostService } from './post.service';

@Module({
  imports: [UserModule],
  controllers: [PostController],
  providers: [PostRepository, PostService],
  exports: [PostService],
})
export class PostModule {}
