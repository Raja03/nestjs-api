import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'user_role',
})
export class UsersRolesEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'user_id',
  })
  userId: number;

  @Column({
    name: 'role_id',
  })
  roleId: number;

  @Column({
    name: 'created_at',
  })
  createdAt: string;
}
