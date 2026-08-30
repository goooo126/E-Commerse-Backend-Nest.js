import {
  ConflictException,
  ForbiddenException,
  HttpException,
  Injectable,
} from '@nestjs/common';
import { SignUpDto } from './Dto/signUp-auth.Dto';
import { SignInDto } from './Dto/signIn-auth.Dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/user/user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import {
  ForgetPasswordDto,
  ChangePassWordDto,
} from './Dto/forgetPassword-auth.Dto';
import { MailerService } from '@nestjs-modules/mailer';
import { emit } from 'process';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
    private readonly mailService: MailerService,
  ) {}

  async signUp(signUpDto: SignUpDto) {
    //* check if user is already exist:
    const existUser = await this.userModel.findOne({ email: signUpDto.email });

    if (existUser) {
      throw new ConflictException('Email already exists');
    }

    //* Hash the password before store it in database:
    const saltOrRounds = 10;
    const password = signUpDto.password;
    const hash = await bcrypt.hash(password, saltOrRounds);

    //* Create new user:
    const newUser = await this.userModel.create({
      ...signUpDto,
      password: hash,
      role: 'user',
      active: true,
    });

    const userResponse = newUser.toObject();
    delete (userResponse as { password?: unknown }).password;
    delete (userResponse as { __v?: unknown }).__v;

    //* create access token:
    const payload = {
      name: signUpDto.name,
      email: signUpDto.email,
      id: newUser._id,
      role: 'user',
    };

    const token = await this.jwtService.signAsync(payload);

    return {
      status: 200,
      message: 'User Created sucessfully :)',
      data: userResponse,
      access_token: token,
    };
  }

  async signIn(signInDto: SignInDto) {
    //* check if user is already exist:
    const existUser = await this.userModel.findOne({ email: signInDto.email });

    if (!existUser) {
      throw new ConflictException('The User is not Found');
    }

    //* check if user account is active or not:
    if (!existUser.active) {
      throw new ForbiddenException();
    }

    //* compare password:
    const passwordIsValid = await bcrypt.compare(
      signInDto.password,
      existUser.password,
    );
    if (!passwordIsValid) {
      throw new HttpException('Email or Password is incorrect', 400);
    }

    //* create access token:
    const payload = {
      name: existUser.name,
      email: signInDto.email,
      id: existUser._id,
      role: existUser.role,
    };

    const token = await this.jwtService.signAsync(payload);

    //* remove password from response
    const userResponse = existUser.toObject();
    delete (userResponse as { password?: unknown }).password;
    delete (userResponse as { __v?: unknown }).__v;

    return {
      status: 200,
      message: 'User Logedin sucessfully :)',
      data: userResponse,
      access_token: token,
    };
  }

  async forgetPassword({ email }: ForgetPasswordDto) {
    //* check if user is already exist:
    const existUser = await this.userModel.findOne({ email: email });

    if (!existUser) {
      throw new ConflictException('The User is not Found');
    }

    //* check if user account is active or not:
    if (!existUser.active) {
      throw new ForbiddenException();
    }

    //* generate 6 digits code:
    const code = Math.floor(100000 + Math.random() * 900000);

    //* genereate the expired date:
    const now = new Date();
    now.setMinutes(now.getMinutes() + 15);

    //* update the database with the code and expiredDate:
    await this.userModel.findByIdAndUpdate(existUser._id, {
      verificationCode: code,
      verificationCodeExpired: now,
    });

    //* send code to user email:
    await this.mailService.sendMail({
      from: `"Ecommerce APP" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Password Reset OTP',
      html: `
        <h2>Password Reset</h2>
        <p>Your OTP code is:</p>
        <h1>${code}</h1>
        <p>This code will expire in 15 minutes.</p>
      `,
    });
    return {
      status: 200,
      message: 'The code sended to the email',
    };
  }

  async verifyCode(verifyCodeDto: ForgetPasswordDto) {
    //* check if user is already exist:
    const existUser = await this.userModel.findOne({
      email: verifyCodeDto.email,
    });

    if (!existUser) {
      throw new ConflictException('The User is not Found');
    }

    //* check if user account is active or not:
    if (!existUser.active) {
      throw new ForbiddenException();
    }

    //* the exprire date of code:
    const now = new Date();
    if (now > existUser.verificationCodeExpired) {
      throw new HttpException('The code is expired :(', 400);
    }

    //* compare the code:
    if (verifyCodeDto.verificationCode !== Number(existUser.verificationCode)) {
      throw new ForbiddenException();
    }

    return {
      status: 200,
      message: 'Code is Valid :)',
    };
  }

  async changePassword(changePasswordDto: ChangePassWordDto) {
    //* check if user is already exist:
    const existUser = await this.userModel.findOne({
      email: changePasswordDto.email,
    });

    if (!existUser) {
      throw new ConflictException('The User is not Found');
    }

    //* check if user account is active or not:
    if (!existUser.active) {
      throw new ForbiddenException();
    }

    //* the exprire date of code:
    const now = new Date();
    if (now > existUser.verificationCodeExpired) {
      throw new HttpException('The code is expired :(', 400);
    }

    //* compare the code:
    if (
      changePasswordDto.verificationCode !== Number(existUser.verificationCode)
    ) {
      throw new ForbiddenException();
    }

    //* Hash the password before store it in database:
    const saltOrRounds = 10;
    const password = changePasswordDto.password;
    const hash = await bcrypt.hash(password, saltOrRounds);

    //* save the new password on the database:
    await this.userModel.findByIdAndUpdate(existUser._id, {
      verificationCode: 0,
      password: hash,
    });

    return {
      status: 200,
      message: 'Password is Changed successfully try to sign in again :)',
    };
  }
}
