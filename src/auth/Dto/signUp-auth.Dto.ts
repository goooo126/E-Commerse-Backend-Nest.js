import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class SignUpDto {
  //* Name:
  @ApiProperty({ description: 'Full name', example: 'Ahmed Ali', minLength: 3, maxLength: 30 })
  @IsString({ message: 'name must be string' })
  @MinLength(3, { message: 'name must be at least 3 characters' })
  @MaxLength(30, { message: 'name must at most 30 characters' })
  name!: string;
  //*=======================================

  //* Email:
  @ApiProperty({ description: 'Unique email address', example: 'ahmed.ali@example.com', format: 'email', minLength: 10 })
  @IsEmail({}, { message: 'email must be string' })
  @MinLength(10, { message: 'email must be at least 10 characters' })
  email!: string;
  //*=======================================

  //* Password:
  @ApiProperty({ description: 'Account password (stored hashed)', example: 'P@ssw0rd123', minLength: 3, maxLength: 20 })
  @IsString({ message: 'password must be string' })
  @MinLength(3, { message: 'password must be at least 3 characters' })
  @MaxLength(20, { message: 'password must at most 20 characters' })
  password!: string;
  //*=======================================
}
