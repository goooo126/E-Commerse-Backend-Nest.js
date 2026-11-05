import { Optional } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDate,
  IsDefined,
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsUrl,
  Length,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
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
  @ApiProperty({
    description:
      'Account password (stored hashed). Required: the `@Optional()` below is the Nest DI decorator, not class-validator\'s, so it does not make the field optional.',
    example: 'P@ssw0rd123',
    minLength: 3,
    maxLength: 20,
  })
  @IsString({ message: 'password must be string' })
  @MinLength(3, { message: 'password must be at least 3 characters' })
  @MaxLength(20, { message: 'password must at most 20 characters' })
  @Optional()
  password!: string;
  //*=======================================

  //* Role:
  @ApiPropertyOptional({ description: 'User role', enum: ['user', 'admin'], example: 'user', default: 'user' })
  @IsString({ message: 'role must be string' })
  @IsOptional()
  @IsEnum(['user', 'admin'], { message: 'role must be user or admin' })
  role!: string;
  //*=======================================

  //* Avatar:
  @ApiPropertyOptional({ description: 'Avatar image URL', example: 'https://example.com/avatars/ahmed.png', format: 'uri' })
  @IsUrl()
  @IsOptional()
  avatar!: string;
  //*=======================================

  //* Age:
  @ApiPropertyOptional({ description: 'Age in years', example: 25, minimum: 18 })
  @IsNumber()
  @IsOptional()
  @Min(18, { message: 'Age must be above 18 years old' })
  age!: number;
  //*=======================================

  //* PhoneNumber:
  @ApiPropertyOptional({ description: 'Egyptian phone number', example: '+201012345678' })
  @IsPhoneNumber('EG', { message: 'phone must be and Egyptation number' })
  @IsOptional()
  phoneNumber!: string;
  //*=======================================

  //* Address:
  @ApiPropertyOptional({ description: 'Postal address', example: '12 Tahrir St, Cairo' })
  @IsString({ message: 'the address must be sting' })
  @IsOptional()
  address!: string;
  //*=======================================

  //* Active:
  @ApiPropertyOptional({
    description: 'Internal – accepted by validation but ignored on creation (the service always sets active=true).',
    example: true,
  })
  @IsBoolean({ message: 'active must be boolean' })
  @IsOptional()
  @IsEnum([false, true], { message: 'active must be true or false only' })
  active!: boolean;
  //*=======================================

  //* verificationCode:
  @ApiPropertyOptional({
    description: 'Internal – used by the password-reset flow, not meant to be set by clients. Must be a 6-character string if sent.',
    example: '123456',
    minLength: 6,
    maxLength: 6,
  })
  @IsString({ message: 'the verificationCode must be string' })
  @Length(6, 6, { message: 'the verificationCode must be 6 characters' })
  @IsOptional()
  verificationCode!: string;
  //*=======================================


  //* verificationCodeExpired:
  @ApiPropertyOptional({
    description: 'Internal – not usable via JSON (validated with @IsDate, so a JSON string fails validation).',
    type: String,
    format: 'date-time',
  })
  @IsDate({ message: 'the verificationCodeExpired must be string' })
  @IsOptional()
  verificationCodeExpired!: string;
  //*=======================================

  //* Gender:
  @ApiPropertyOptional({ description: 'Gender', enum: ['male', 'female'], example: 'male' })
  @IsString({ message: 'the gender must be string' })
  @IsOptional()
  @IsEnum(['male', 'female'], { message: 'the gender must be male or female' })
  gender!: string;
  //*=======================================
}
