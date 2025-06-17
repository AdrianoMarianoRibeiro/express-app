import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { AppBaseEntity } from '../../shared/entities';
import { UserEntity } from '../user/user.entity';

@Entity('posts')
export class PostEntity extends AppBaseEntity {
  @Column({ type: 'varchar', nullable: false })
  post: string;

  @ManyToOne(() => UserEntity, (userEntity) => userEntity.id, {
    cascade: true,
    nullable: true,
  })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  userEntity: UserEntity;
}
