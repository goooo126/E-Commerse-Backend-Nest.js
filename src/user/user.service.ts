import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './user.schema';
import mongoose, { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto) {
    //* Check if the user is already exist:
    const isUserExisted = await this.userModel.findOne({
      email: createUserDto.email,
    });
    if (isUserExisted) {
      throw new HttpException('User already exist', 400);
    }

    //* Hash the password before store it in database:
    const saltOrRounds = 10;
    const password = createUserDto.password;
    const hash = await bcrypt.hash(password, saltOrRounds);

    //* Create new user:
    const user = this.userModel.create({
      ...createUserDto,
      password: hash,
      role: 'user',
      active: true,
    });
    return {
      status: 200,
      message: 'Get All users sucessfully :)',
      data: {
        name: (await user).name,
        email: (await user).email,
        role: (await user).role,
      },
    };
  }

  async findAll() {
    const users = await this.userModel.find().select(['-__v', '-password']);
    return {
      status: 200,
      message: 'User created sucessfully :)',
      data: users,
    };
  }

  async findOne(id: string) {
    //* check the Id is an objectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new HttpException(`Is ${id} a valid ObjectId?`, 400);
    }

    //* check if the user is exist
    const user = await this.userModel
      .findById(id)
      .select(['-__v', '-password']);

    if (!user) {
      throw new NotFoundException();
    }
    return {
      status: 200,
      message: 'User Founded sucessfully :)',
      data: {
        ...user['_doc'],
      },
    };
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    //* check the Id is an objectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new HttpException(`Is ${id} a valid ObjectId?`, 400);
    }

    //* check if the user is exist
    const user = await this.userModel.findById(id);

    if (!user) {
      throw new NotFoundException();
    }

    //* check if user change the email:
    if (updateUserDto.email&&updateUserDto.email!=user.email) {
      const existUserWithSameEmail = await this.userModel.findOne({
        email: updateUserDto.email,
      });

      if (existUserWithSameEmail) {
        throw new HttpException('This email already exist', 409);
      }
    }

    //* check if the user change the password:
    if (updateUserDto.password) {
      //* Hash the password before store it in database:
      const saltOrRounds = 10;
      const password = updateUserDto.password;
      const hash = await bcrypt.hash(password, saltOrRounds);
      updateUserDto.password = hash;
    }

    const updatedUser = await this.userModel.findByIdAndUpdate(
      id,
      updateUserDto,
      { new: true },
    ).select(['-__v','-password']);

    return {
      status: 200,
      message: 'User Updated sucessfully :)',
      data: {
        updatedUser,
      },
    };
  }

  async remove(id: string) {
    //* check the Id is an objectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new HttpException(`Is ${id} a valid ObjectId?`, 400);
    }


    //* check if the user is exist
    const user = await this.userModel.findById(id);

    if (!user) {
      throw new NotFoundException();
    }

    //TODO: Handle the relate Date in future

    const deleteUser = await this.userModel.findByIdAndDelete(id);
    
    //TODO: Invalidate Sessions

    return {
      status:200,
      message: "User Deleted sucessfully :("
    };
  }
}
