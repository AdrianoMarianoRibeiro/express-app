import { inject, injectable } from 'tsyringe';
import { DataSource, Repository } from 'typeorm';
import { AppBaseRepository } from '../../shared/repositories';
import { PostEntity } from './post.entity';

@injectable()
export class PostRepository extends AppBaseRepository<PostEntity> {
  protected repository: Repository<PostEntity>;

  constructor(@inject(DataSource) private dataSource: DataSource) {
    super(dataSource.getRepository(PostEntity));
    this.repository = this.dataSource.getRepository(PostEntity);
  }

  async count(): Promise<number> {
    return this.repository.count();
  }

  async findWithPagination(page: number, limit: number): Promise<[PostEntity[], number]> {
    return this.repository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });
  }
}
