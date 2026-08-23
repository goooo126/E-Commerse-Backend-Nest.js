import { ConflictException, HttpException, Injectable } from '@nestjs/common';
import { SignUpDto } from './Dto/signUp-auth.Dto';
import { SignInDto } from './Dto/signIn-auth.Dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/user/user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Role } from 'src/user/enums/roles.enum';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { single } from 'rxjs';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
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
}
