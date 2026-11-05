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
import {
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  ApiEnvelopeResponse,
  ApiErrors,
} from 'src/common/swagger/swagger.helpers';
import { UserResponseDto } from 'src/user/dto/user-response.dto';
import { GoogleAuthResponseDto } from './Dto/google-auth-response.dto';

@ApiTags('Auth')
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
  @ApiOperation({
    summary: 'Register a new account',
    description:
      'Creates a new user with role `user` (active) and returns the user plus a JWT. **Access:** Public. The password is hashed; it is never returned.',
  })
  @ApiEnvelopeResponse({
    status: 201,
    bodyStatus: 200,
    description: 'User created. The HTTP status is 201 but the `status` field in the body is 200.',
    message: 'User Created sucessfully :)',
    model: UserResponseDto,
    extra: { access_token: { type: 'string', description: 'JWT to send as `Authorization: Bearer <token>`', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhOGIyNDY5In0.signature' } },
  })
  @ApiErrors(400, [409, 'Conflict – the email already exists (`Email already exists`)'])
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
  @ApiOperation({
    summary: 'Sign in with email and password',
    description:
      'Authenticates a user and returns the user plus a JWT. **Access:** Public. Note: an unknown email returns 409 (not 404), an inactive account returns 403 and a wrong password returns 400.',
  })
  @ApiEnvelopeResponse({
    status: 201,
    bodyStatus: 200,
    description: 'Signed in. The HTTP status is 201 but the `status` field in the body is 200.',
    message: 'User Logedin sucessfully :)',
    model: UserResponseDto,
    extra: { access_token: { type: 'string', description: 'JWT to send as `Authorization: Bearer <token>`', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhOGIyNDY5In0.signature' } },
  })
  @ApiErrors(
    [400, 'Bad Request – validation failed, or the password is wrong (`Email or Password is incorrect`)'],
    [403, 'Forbidden – the account is not active'],
    [409, 'Conflict – no user with this email (`The User is not Found`)'],
  )
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
  @ApiOperation({
    summary: 'Request a password-reset code',
    description:
      'Generates a 6-digit code, stores it on the user with a 15-minute expiry and emails it. **Access:** Public. Only `email` is used (a `verificationCode` in the body is ignored). Calling it again replaces the previous code.',
  })
  @ApiEnvelopeResponse({
    status: 201,
    bodyStatus: 200,
    description: 'Code sent. The HTTP status is 201 but the `status` field in the body is 200.',
    message: 'The code sended to the email',
  })
  @ApiErrors(
    400,
    [403, 'Forbidden – the account is not active'],
    [409, 'Conflict – no user with this email (`The User is not Found`)'],
    [500, 'Internal Server Error – e.g. the email could not be sent'],
  )
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
  @ApiOperation({
    summary: 'Verify a password-reset code',
    description:
      'Checks the 6-digit code previously sent by forget-password. **Access:** Public. The code is valid for 15 minutes; after that the endpoint returns 400 `The code is expired :(`. A wrong or missing code returns 403 (same as an inactive account). The code is not consumed by this call.',
  })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['email', 'verificationCode'],
      properties: {
        email: { type: 'string', format: 'email', minLength: 10, example: 'ahmed.ali@example.com' },
        verificationCode: { type: 'number', description: 'The 6-digit code received by email', example: 123456 },
      },
    },
  })
  @ApiEnvelopeResponse({
    status: 201,
    bodyStatus: 200,
    description: 'Code is valid. The HTTP status is 201 but the `status` field in the body is 200.',
    message: 'Code is Valid :)',
  })
  @ApiErrors(
    [400, 'Bad Request – validation failed, or the code is expired (`The code is expired :(`)'],
    [403, 'Forbidden – wrong or missing code, or the account is not active'],
    [409, 'Conflict – no user with this email (`The User is not Found`)'],
  )
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
  @ApiOperation({
    summary: 'Reset the password using a code',
    description:
      'Sets a new password after validating the 6-digit code from forget-password. **Access:** Public. The code expires 15 minutes after it was issued (400 `The code is expired :(`); a wrong code returns 403. On success the stored code is reset to 0.',
  })
  @ApiEnvelopeResponse({
    status: 200,
    description: 'Password changed.',
    message: 'Password is Changed successfully try to sign in again :)',
  })
  @ApiErrors(
    [400, 'Bad Request – validation failed, or the code is expired (`The code is expired :(`)'],
    [403, 'Forbidden – wrong code, or the account is not active'],
    [409, 'Conflict – no user with this email (`The User is not Found`)'],
  )
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
  @ApiOperation({
    summary: 'Sign in / sign up with Google',
    description:
      'Verifies a Google ID token. If no account is linked to the Google id, a new Google-only user (role `user`, email verified) is created; then an application JWT is returned. **Access:** Public. The response is NOT wrapped in the usual `{ status, message, data }` envelope.',
  })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['idToken'],
      properties: {
        idToken: { type: 'string', description: 'Google ID token obtained from Google Sign-In on the client', example: 'eyJhbGciOiJSUzI1NiIsImtpZCI6IjEyMyJ9.eyJzdWIiOiIxMDgyMzQ1Njc4OTAifQ.signature' },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Authenticated with Google', type: GoogleAuthResponseDto })
  @ApiErrors(
    [401, 'Unauthorized – missing/invalid Google ID token, or the Google email is not verified'],
    [409, 'Conflict – the email is already registered locally; sign in with email/password instead'],
  )
  @Post('google')
  loginWithGoogle(@Body('idToken') idToken: string) {
    return this.authGoogleService.googleLogin(idToken);
  }
}
