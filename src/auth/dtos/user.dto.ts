import { IsNumber, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  email: string;

  @IsString()
  password: string;
}

export class ValidateUserDto {
  @IsString()
  email: string;

  @IsString()
  password: string;
}

export class loginUserDto {
  @IsNumber()
  id: number;

  @IsString()
  email: string;

  @IsString()
  password: string;
}
