import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './user.schema';
import mongoose, { Model, SortOrder } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { GetUsersDto } from './dto/get-users.dto';

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
      role: createUserDto.role ? createUserDto.role : 'user',
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

  async findAll(query: GetUsersDto) {
    const {
      limit = 10,
      skip = 0,
      sort = 'createdAt',
      order = 'desc',
      name,
      email,
      role,
      active,
    } = query;

    const filter: any = {};

    // Filter by name
    if (name) {
      filter.name = {
        $regex: name,
        $options: 'i',
      };
    }

    // Filter by email
    if (email) {
      filter.email = {
        $regex: email,
        $options: 'i',
      };
    }

    // Filter by role
    if (role) {
      filter.role = role;
    }

    // Filter by active
    if (active!==undefined) {
      filter.active = active;
    }

    const sortOptions: Record<string, SortOrder> = {
      [sort]: order === 'asc' ? 1 : -1,
    };

    const [users, total] = await Promise.all([
      this.userModel
        .find(filter)
        .select('-password -__v')
        .sort(sortOptions)
        .skip(skip)
        .limit(limit),

      this.userModel.countDocuments(filter),
    ]);

    return {
      status: 200,
      message: 'Users fetched successfully',
      data: {
        users,
        pagination: {
          total,
          limit,
          skip,
          returned: users.length,
        },
      },
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
    if (updateUserDto.email && updateUserDto.email != user.email) {
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

    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .select(['-__v', '-password']);

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
      status: 200,
      message: 'User Deleted sucessfully :(',
    };
  }
}
