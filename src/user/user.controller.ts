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
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  ApiEnvelopeResponse,
  ApiErrors,
  ApiMongoIdParam,
  ApiPrivate,
} from 'src/common/swagger/swagger.helpers';
import {
  CreatedUserResponseDto,
  UserResponseDto,
} from './dto/user-response.dto';
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  //?=======================================
  //* @Docs   admin can create a user
  //* @Route  POST /api/v1/user
  //* @access Private[admin]
  //?=======================================
  @ApiTags('Users (admin)')
  @ApiOperation({
    summary: 'Create a user',
    description:
      'Creates a user (role defaults to `user`, always created active, password hashed). **Access:** Admin. Returns only name, email and role of the new user.',
  })
  @ApiEnvelopeResponse({
    status: 201,
    bodyStatus: 200,
    description: 'User created. The HTTP status is 201 but the `status` field in the body is 200.',
    message: 'Get All users sucessfully :)',
    model: CreatedUserResponseDto,
  })
  @ApiErrors(
    [400, 'Bad Request – validation failed, or the email already exists (`User already exist`)'],
  )
  @ApiPrivate('admin')
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
  @ApiTags('Users (admin)')
  @ApiOperation({
    summary: 'List users',
    description:
      'Returns a paginated, filterable and sortable list of users (password excluded). **Access:** Admin. Defaults: limit 10, skip 0, sorted by createdAt desc. `name` and `email` are case-insensitive partial matches; `role` and `active` are exact.',
  })
  @ApiEnvelopeResponse({
    description: 'Users fetched.',
    message: 'Users fetched successfully',
    list: { key: 'users', model: UserResponseDto },
  })
  @ApiErrors(400)
  @ApiPrivate('admin')
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
  @ApiTags('Profile')
  @ApiOperation({
    summary: 'Get my profile',
    description: 'Returns the profile of the logged-in user (taken from the JWT). **Access:** User & Admin.',
  })
  @ApiEnvelopeResponse({
    description: 'Profile found.',
    message: 'User Found sucessfully :)',
    model: UserResponseDto,
  })
  @ApiErrors(404)
  @ApiPrivate('user', 'admin')
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
  @ApiTags('Profile')
  @ApiOperation({
    summary: 'Update my profile',
    description:
      'Updates the logged-in user. All fields are optional; a new password is hashed. **Access:** User & Admin. Sending `role` as a non-admin returns 401 even if the value is unchanged. Changing to an email used by another user returns 409.',
  })
  @ApiEnvelopeResponse({
    description: 'Profile updated.',
    message: 'User Updated sucessfully :)',
    wrap: { key: 'updatedUser', model: UserResponseDto },
  })
  @ApiErrors(
    [400, 'Bad Request – validation failed'],
    [401, 'Unauthorized – missing/invalid token, or a non-admin sent `role`'],
    [404, 'Not Found – the user no longer exists'],
    [409, 'Conflict – the email is used by another user (`This email already exist`)'],
  )
  @ApiPrivate('user', 'admin')
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
  @ApiTags('Profile')
  @ApiOperation({
    summary: 'Delete my account (soft delete)',
    description:
      'Deactivates the logged-in user by setting `active` to false; the document is NOT removed. **Access:** User & Admin. A deactivated user can no longer sign in.',
  })
  @ApiEnvelopeResponse({
    description: 'Account deactivated.',
    message: 'User Delete sucessfully :(',
  })
  @ApiErrors(404)
  @ApiPrivate('user', 'admin')
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
  @ApiTags('Users (admin)')
  @ApiOperation({
    summary: 'Get a user by id',
    description:
      '⚠️ Intended for admins only, but this route currently has no auth guard in the code. Returns the user (password excluded).',
  })
  @ApiMongoIdParam('id', 'User id')
  @ApiEnvelopeResponse({
    description: 'User found.',
    message: 'User Founded sucessfully :)',
    model: UserResponseDto,
  })
  @ApiErrors([400, 'Bad Request – `id` is not a valid ObjectId'], 404)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  //?=======================================
  //* @Docs   admin can update a user
  //* @Route  PATCH /api/v1/user/:id
  //* @access Private[admin]
  //?=======================================
  @ApiTags('Users (admin)')
  @ApiOperation({
    summary: 'Update a user by id',
    description:
      '⚠️ Intended for admins only, but this route currently has no auth guard in the code. Updates any user; a new password is hashed. Unlike PATCH /user/profile, `role` may be sent freely. Note: this route has no ValidationPipe, so the body is not validated.',
  })
  @ApiMongoIdParam('id', 'User id')
  @ApiEnvelopeResponse({
    description: 'User updated.',
    message: 'User Updated sucessfully :)',
    wrap: { key: 'updatedUser', model: UserResponseDto },
  })
  @ApiErrors(
    [400, 'Bad Request – `id` is not a valid ObjectId'],
    404,
    [409, 'Conflict – the email is used by another user (`This email already exist`)'],
  )
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  //?=======================================
  //* @Docs   admin can delete a user
  //* @Route  DELETE /api/v1/user/:id
  //* @access Private[admin]
  //?=======================================
  @ApiTags('Users (admin)')
  @ApiOperation({
    summary: 'Delete a user by id',
    description:
      '⚠️ Intended for admins only, but this route currently has no auth guard in the code. Permanently deletes the user document (hard delete).',
  })
  @ApiMongoIdParam('id', 'User id')
  @ApiEnvelopeResponse({
    description: 'User deleted.',
    message: 'User Deleted sucessfully :(',
  })
  @ApiErrors([400, 'Bad Request – `id` is not a valid ObjectId'], 404)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
