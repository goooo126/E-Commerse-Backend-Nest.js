import {
  IsBoolean,
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
  @IsString({ message: 'name must be string' })
  @MinLength(3, { message: 'name must be at least 3 characters' })
  @MaxLength(30, { message: 'name must at most 30 characters' })
  name!: string;
  //*=======================================

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

  //* Role:
  @IsString({ message: 'role must be string' })
  @IsOptional()
  @IsEnum(['user', 'admin'], { message: 'role must be user or admin' })
  role!: string;
  //*=======================================

  //* Avatar:
  @IsUrl()
  @IsOptional()
  avatar!: string;
  //*=======================================

  //* Age:
  @IsNumber()
  @IsOptional()
  @Min(18, { message: 'Age must be above 18 years old' })
  age!: number;
  //*=======================================

  //* PhoneNumber:
  @IsPhoneNumber('EG', { message: 'phone must be and Egyptation number' })
  @IsOptional()
  phoneNumber!: string;
  //*=======================================

  //* Address:
  @IsString({ message: 'the address must be sting' })
  @IsOptional()
  address!: string;
  //*=======================================

  //* Active:
  @IsBoolean({ message: 'active must be boolean' })
  @IsOptional()
  @IsEnum([false, true], { message: 'active must be true or false only' })
  active!: boolean;
  //*=======================================

  //* verificationCode:
  @IsString({ message: 'the verificationCode must be string' })
  @Length(6, 6, { message: 'the verificationCode must be 6 characters' })
  @IsOptional()
  verificationCode!: string;
  //*=======================================

  //* Gender:
  @IsString({ message: 'the gender must be string' })
  @IsOptional()
  @IsEnum(['male', 'female'], { message: 'the gender must be male or female' })
  gender!: string;
  //*=======================================
}
