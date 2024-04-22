import { IsNotEmpty, IsString } from 'class-validator';

export class CreateUserRoleDto {
  @IsString()
  @IsNotEmpty()
  role: string;
}
