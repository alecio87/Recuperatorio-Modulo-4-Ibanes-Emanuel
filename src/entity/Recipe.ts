import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
} from "typeorm";

import { User } from "./User";

@Entity()
export class Recipe extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.recipe)
  user: User;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  image: string;

  @Column()
  ingredients: string;

  @Column({ length: 1000 }) 
  preparation: string;

  @Column()
  estimatedPreparationTime: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}