import { inject, injectable } from "tsyringe";
import { DataSource, Repository } from "typeorm";
import { AppBaseRepository } from "../../shared/repositories";
import { UserEntity } from "./user.entity";

@injectable()
export class UserRepository extends AppBaseRepository<UserEntity> {
  protected repository: Repository<UserEntity>;

  constructor(@inject(DataSource) private dataSource: DataSource) {
    super(dataSource.getRepository(UserEntity));
    this.repository = this.dataSource.getRepository(UserEntity);
  }

  async count(): Promise<number> {
    return this.repository.count();
  }

  async findWithPagination(
    page: number,
    limit: number
  ): Promise<[UserEntity[], number]> {
    return this.repository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: "DESC" },
    });
  }
}
