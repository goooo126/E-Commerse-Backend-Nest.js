import { Body, Controller, Post, ValidationPipe, Patch } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './Dto/signUp-auth.Dto';
import { SignInDto } from './Dto/signIn-auth.Dto';
import {
  ForgetPasswordDto,
  ChangePassWordDto,
} from './Dto/forgetPassword-auth.Dto';
import { GoogleAuth } from 'google-auth-library';
import { GoogleAuthService } from './google.auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly authGoogleService: GoogleAuthService,
  ) {}

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

  //?=======================================
  //* @Docs   any user can forget password
  //* @Route  POST /api/v1/auth/forget-password
  //* @access Public
  //?=======================================
  @Post('forget-password')
  forgetPassword(
    @Body(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    )
    email: ForgetPasswordDto,
  ) {
    return this.authService.forgetPassword(email);
  }

  //?=======================================
  //* @Docs   any user can verify the code
  //* @Route  POST /api/v1/auth/verify-code
  //* @access Public
  //?=======================================
  @Post('verify-code')
  verifyCode(
    @Body(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    )
    verifyCodeDto: ForgetPasswordDto,
  ) {
    return this.authService.verifyCode(verifyCodeDto);
  }

  //?=======================================
  //* @Docs   any user can change it password
  //* @Route  POST /api/v1/auth/change-password
  //* @access Public
  //?=======================================
  @Patch('change-password')
  changePassword(
    @Body(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    )
    changePasswordDto: ChangePassWordDto,
  ) {
    return this.authService.changePassword(changePasswordDto);
  }

  //?=======================================
  //* @Docs   any user can login or signup using google
  //* @Route  POST /api/v1/auth/google
  //* @access Public
  //?=======================================
  @Post('google')
  loginWithGoogle(@Body('idToken') idToken: string) {
    return this.authGoogleService.googleLogin(idToken);
  }
}
