import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
  UseGuards
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from './guard/auth.guard';
import { Roles } from './decorator/roles.decorator';
import { Role } from './enums/roles.enum';
import { RolesGuard } from './guard/role.guard';
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
    createUserDto: CreateUserDto
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
  findAll() {
    return this.userService.findAll();
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
