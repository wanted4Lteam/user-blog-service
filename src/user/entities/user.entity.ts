import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum Grade {
  ADMIN = 'admin',
  SILVER = 'silver',
  GOLD = 'gold',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  gender: string;

  @Column()
  name: string;

  @Column({ type: 'enum', enum: Grade, default: Grade.SILVER })
  grade: Grade;

  @Column()
  age: number;

  @Column()
  phone: string;

  @Column()
  lastconnect_date: Date;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updateAt: Date;

  @DeleteDateColumn()
  deleteAt: Date;
}
