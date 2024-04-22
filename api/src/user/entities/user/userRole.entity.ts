import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from './user.entity';

@Entity({
  name: 'userrole',
})
export class UserRoleEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  role: string;

  @Column({
    name: 'created_at',
  })
  createdAt: string;

  @ManyToMany(() => UserEntity, (user) => user.userRoles)
  users: UserEntity[];
}
