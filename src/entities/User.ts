import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('increment')
  id: number = 0;

  @Column()
  firstname?: string;

  @Column({
    nullable: true,
  })
  lastname?: string;

  @Column({
    unique: true,
    nullable: true,
  })
  email?: string;

  @Column({
    type: 'date'
  })
  birthday_date?: Date;

  @Column()
  location?: string;
}
