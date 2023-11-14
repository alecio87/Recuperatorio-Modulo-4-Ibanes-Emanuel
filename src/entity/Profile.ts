import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToOne,
  JoinColumn,
} from "typeorm";
import { User } from "./User";

@Entity()
export class Profile extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  dni: string;

  @Column()
  gender: string;

  @Column()
  address: string;

  @Column()
  city: string;

  @Column()
  country: string;

  @Column()
  cellPhone: string;

  @Column()
  photo: string;

  @OneToOne((type) => User, (user) => user.profile, { onDelete: "CASCADE" })
  @JoinColumn()
  user: User;
}