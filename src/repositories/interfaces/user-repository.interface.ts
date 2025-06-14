import { User } from "../../entities/user.entity";

export interface IUserRepository {
  findAll(): Promise<User[]>;
  findById(id: number): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(user: User): Promise<User>;
  update(user: User): Promise<User>;
  delete(id: number): Promise<boolean>;
  count(): Promise<number>;
  findWithPagination(page: number, limit: number): Promise<[User[], number]>;
}
