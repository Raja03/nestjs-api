import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDetailsDto {
  @IsInt()
  userId: number;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  country: string;
}
