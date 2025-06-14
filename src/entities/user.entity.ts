import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { AppBaseEntity } from "../shared/entities";

@Entity("users")
export class User extends AppBaseEntity {
  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({name: 'is_active', default: true })
  isActive: boolean;
}
