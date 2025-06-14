import { injectable, inject } from "tsyringe";
import { Repository, DataSource } from "typeorm";
import { User } from "../entities/user.entity";
import { IUserRepository } from "./interfaces/user-repository.interface";

@injectable()
export class UserRepository implements IUserRepository {
  private repository: Repository<User>;

  constructor(@inject(DataSource) private dataSource: DataSource) {
    this.repository = this.dataSource.getRepository(User);
  }

  async findAll(): Promise<User[]> {
    return this.repository.find();
  }

  async findById(id: string): Promise<User | null> {
    return this.repository.findOneBy({ id });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.repository.findOneBy({ email });
  }

  async create(user: User): Promise<User> {
    return this.repository.save(user);
  }

  async update(user: User): Promise<User> {
    return this.repository.save(user);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.softDelete(id);
    const affectedRows = result.affected ?? 0;
    return affectedRows > 0;
  }

  async count(): Promise<number> {
    return this.repository.count();
  }

  async findWithPagination(
    page: number,
    limit: number
  ): Promise<[User[], number]> {
    return this.repository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: "DESC" },
    });
  }
}
