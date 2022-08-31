import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Notice_Board {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({nullable: true})
  user_id: string;

  @Column()
  title: string;

  @Column()
  content: string;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updateAt: Date;

  @DeleteDateColumn()
  deleteAt: Date;
}
