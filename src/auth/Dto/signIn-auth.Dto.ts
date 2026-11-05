import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class SignInDto {
  //* Email:
  @ApiProperty({ description: 'Email of the registered account', example: 'ahmed.ali@example.com', format: 'email', minLength: 10 })
  @IsEmail({}, { message: 'email must be string' })
  @MinLength(10, { message: 'email must be at least 10 characters' })
  email!: string;
  //*=======================================

  //* Password:
  @ApiProperty({ description: 'Account password', example: 'P@ssw0rd123', minLength: 3, maxLength: 20 })
  @IsString({ message: 'password must be string' })
  @MinLength(3, { message: 'password must be at least 3 characters' })
  @MaxLength(20, { message: 'password must at most 20 characters' })
  password!: string;
  //*=======================================
}
