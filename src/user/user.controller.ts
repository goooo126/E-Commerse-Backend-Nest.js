import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
  UseGuards,
  Query,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from './guard/auth.guard';
import { Roles } from './decorator/roles.decorator';
import { Role } from './enums/roles.enum';
import { RolesGuard } from './guard/role.guard';
import { GetUsersDto } from './dto/get-users.dto';
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  //?=======================================
  //* @Docs   admin can create a user
  //* @Route  POST /api/v1/user
  //* @access Private[admin]
  //?=======================================
  @Post()
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  create(
    @Body(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    )
    createUserDto: CreateUserDto,
  ) {
    return this.userService.create(createUserDto);
  }

  //?=======================================
  //* @Docs   admin can get all users
  //* @Route  GET /api/v1/user
  //* @access Private[admin]
  //?=======================================
  @Get()
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  findAll(
    @Query(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    )
    query: GetUsersDto,
  ) {
    return this.userService.findAll(query);
  }

  //?=======================================
  //* @Docs   Any user can get profile's data
  //* @Route  GET /api/v1/user/profile
  //* @access Private[user,admin]
  //?=======================================
  @Get('profile')
  @Roles(Role.Admin, Role.User)
  @UseGuards(AuthGuard, RolesGuard)
  getProfile(@Req() req: Request) {
    const id = req['user'].id;
    return this.userService.getProfile(id);
  }

  //?=======================================
  //* @Docs   Any user can update profile's data
  //* @Route  PATCH /api/v1/user/profile
  //* @access Private[user,admin]
  //?=======================================
  @Patch('profile')
  @Roles(Role.Admin, Role.User)
  @UseGuards(AuthGuard, RolesGuard)
  updateProfile(
    @Req() req: Request,
    @Body(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    )
    updateUserDto: UpdateUserDto,
  ) {
    const id = req['user'].id;
    return this.userService.updateProfile(id, updateUserDto);
  }

  //?=======================================
  //* @Docs   Any user can delete profile's data
  //* @Route  DELETE /api/v1/user/profile
  //* @access Private[user,admin]
  //?=======================================
  @Delete('profile')
  @Roles(Role.Admin, Role.User)
  @UseGuards(AuthGuard, RolesGuard)
  deleteProfile(
    @Req() req: Request ) {
    const id = req['user'].id;
    return this.userService.deleteProfile(id);
  }

  //?=======================================
  //* @Docs   admin can get a user
  //* @Route  GET /api/v1/user/:id
  //* @access Private[admin]
  //?=======================================
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  //?=======================================
  //* @Docs   admin can update a user
  //* @Route  PATCH /api/v1/user/:id
  //* @access Private[admin]
  //?=======================================
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  //?=======================================
  //* @Docs   admin can delete a user
  //* @Route  DELETE /api/v1/user/:id
  //* @access Private[admin]
  //?=======================================
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
