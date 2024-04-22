import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'userdbconn',
})
export class UserDbConnEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'user_id',
  })
  userId: number;

  @Column({
    name: 'db_name',
  })
  dbName: string;

  @Column({
    name: 'created_at',
  })
  createdAt: string;
}
