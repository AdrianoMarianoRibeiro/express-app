import { UserController } from "../controllers/user.controller";
import { Module } from "../decorators/module.decorator";
import { UserRepository } from "../repositories/user.repository";
import { UserService } from "../services/user.service";

@Module({
  controllers: [UserController],
  providers: [UserService, UserRepository],
  exports: [UserService, UserRepository],
})
export class UserModule {}
