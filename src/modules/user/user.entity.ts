import { Column, Entity } from "typeorm";
import { AppBaseEntity } from "../../shared/entities";

@Entity("users")
export class UserEntity extends AppBaseEntity {
  @Column({ type: "varchar", unique: true, nullable: false, length: 255 })
  email: string;

  @Column({ type: "varchar", nullable: false, length: 255 })
  name: string;

  @Column({ type: "varchar", nullable: false, length: 255 })
  password: string;

  @Column({ type: "boolean", nullable: false, default: true })
  status: boolean;
}
