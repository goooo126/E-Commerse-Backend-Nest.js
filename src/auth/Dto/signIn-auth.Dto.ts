import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class SignInDto {
  //* Email:
  @IsEmail({}, { message: 'email must be string' })
  @MinLength(10, { message: 'email must be at least 10 characters' })
  email!: string;
  //*=======================================

  //* Password:
  @IsString({ message: 'password must be string' })
  @MinLength(3, { message: 'password must be at least 3 characters' })
  @MaxLength(20, { message: 'password must at most 20 characters' })
  password!: string;
  //*=======================================
}
