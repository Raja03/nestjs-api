import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from './user.entity';

@Entity({
  name: 'usertype',
})
export class UserTypeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: string;

  @Column({
    name: 'created_at',
  })
  createdAt: string;

  @OneToMany(() => UserEntity, (user) => user.userType)
  users: UserEntity[];
}
