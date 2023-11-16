import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
} from "typeorm";
import { Profile } from "./Profile";
import { Recipe } from "./Recipe";

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  email: string;
  @Column()
  password: string;
  @Column({ default: true })
  active: boolean;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne((type) => Profile, (profile) => profile.user, { eager: true, cascade: true })
  profile: Profile;

  @OneToMany(() => Recipe, (recipe) => recipe.user)
  recipe: Recipe[];
}