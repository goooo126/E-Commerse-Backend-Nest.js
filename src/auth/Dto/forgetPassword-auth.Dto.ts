import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDefined, IsEmail, IsNumber, IsOptional, IsString, Length, MaxLength, MinLength } from 'class-validator';

export class ForgetPasswordDto {
  //* Email:
  @ApiProperty({ description: 'Email of the registered account', example: 'ahmed.ali@example.com', format: 'email', minLength: 10 })
  @IsEmail({}, { message: 'email must be string' })
  @MinLength(10, { message: 'email must be at least 10 characters' })
  email!: string;
  //*=======================================

   //* verificationCode:
  @ApiPropertyOptional({
    description: 'Not used by forget-password. Required in practice by verify-code (a missing/wrong code returns 403).',
    example: 123456,
  })
  @IsNumber({}, { message: 'the code must be a number' })
  @IsOptional()
  verificationCode!: number;
  //* ====================================================
}

export class ChangePassWordDto {
  //* Email:
  @ApiProperty({ description: 'Email of the registered account', example: 'ahmed.ali@example.com', format: 'email', minLength: 10 })
  @IsEmail({}, { message: 'email must be string' })
  @MinLength(10, { message: 'email must be at least 10 characters' })
  email!: string;
  //*=======================================
  
  //* Password:
   @ApiProperty({ description: 'New password (stored hashed)', example: 'N3wP@ssw0rd', minLength: 3, maxLength: 20 })
   @IsString({ message: 'password must be string' })
   @MinLength(3, { message: 'password must be at least 3 characters' })
   @MaxLength(20, { message: 'password must at most 20 characters' })
   password!: string;
   //*=======================================

    //* verificationCode:
  @ApiPropertyOptional({
    description: 'Not used by forget-password. Required in practice by verify-code (a missing/wrong code returns 403).',
    example: 123456,
  })
  @IsNumber({}, { message: 'the code must be a number' })
  @IsDefined()
  verificationCode!: number;
  //* ====================================================
}
