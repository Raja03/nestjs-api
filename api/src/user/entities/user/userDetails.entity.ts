import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';

@Entity({
  name: 'userdetails',
})
export class UserDetailsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'user_id',
  })
  userId: number;

  @Column()
  city: string;

  @Column()
  country: string;

  @Column({
    name: 'created_at',
  })
  createdAt: string;

  @OneToOne(() => UserEntity, (user) => user.userDetails)
  @JoinColumn({
    name: 'user_id',
  })
  user: UserEntity;
}
