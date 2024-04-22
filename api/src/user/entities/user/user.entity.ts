import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserDetailsEntity } from './userDetails.entity';
import { UserRoleEntity } from './userRole.entity';
import { UserTypeEntity } from './userType.entity';

@Entity({
  name: 'users',
})
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'type_id',
  })
  typeId: number;

  @Column({
    name: 'first_name',
  })
  firstName: string;

  @Column({
    name: 'last_name',
  })
  lastName: string;

  @Column()
  email: string;

  @Column({
    name: 'password',
  })
  passwordHash: string;

  @Column()
  token: string;

  @Column({
    name: 'created_at',
  })
  createdAt: string;

  @OneToOne(() => UserDetailsEntity, (userDetails) => userDetails.user, {
    onDelete: 'CASCADE',
  })
  userDetails: UserDetailsEntity;

  @ManyToOne(() => UserTypeEntity, (userType) => userType.users, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'type_id',
  })
  userType: UserTypeEntity;

  @ManyToMany(() => UserRoleEntity, (userRole) => userRole.users, {
    onDelete: 'CASCADE',
  })
  @JoinTable({
    name: 'user_role',
    joinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'role_id',
      referencedColumnName: 'id',
    },
  })
  userRoles: UserRoleEntity[];
}
