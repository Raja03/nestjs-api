import { IsInt, IsString } from 'class-validator';

export class CreateUserDbConnDto {
  @IsInt()
  userId: number;

  @IsString()
  dbName: string;
}
