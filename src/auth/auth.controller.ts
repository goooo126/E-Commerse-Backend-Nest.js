import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './Dto/signUp-auth.Dto';
import { SignInDto } from './Dto/signIn-auth.Dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  //?=======================================
  //* @Docs   Anyone can sign up and create new user
  //* @Route  POST /api/v1/auth/sign-up
  //* @access Public
  //?=======================================
  @Post('sign-up')
  signUp(
    @Body(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    )
    signUpDto: SignUpDto,
  ) {
    return this.authService.signUp(signUpDto);
  }


  //?=======================================
  //* @Docs   Any user can signin and access her/his account
  //* @Route  POST /api/v1/auth/sign-in
  //* @access Public
  //?=======================================
  @Post('sign-in')
  signIn(
    @Body(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    )
    signINDto: SignInDto,
  ) {
    return this.authService.signIn(signINDto);
  }
}

