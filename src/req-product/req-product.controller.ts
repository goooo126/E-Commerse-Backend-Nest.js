import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ValidationPipe,
  Query,
} from '@nestjs/common';
import { ReqProductService } from './req-product.service';
import { CreateReqProductDto } from './dto/create-req-product.dto';
import { UpdateReqProductDto } from './dto/update-req-product.dto';
import { Role } from 'src/user/enums/roles.enum';
import { Roles } from 'src/user/decorator/roles.decorator';
import { AuthGuard } from 'src/user/guard/auth.guard';
import { RolesGuard } from 'src/user/guard/role.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { GetReqProductsDto } from './dto/get-reqProducts.dto';

@Controller('req-product')
export class ReqProductController {
  constructor(private readonly reqProductService: ReqProductService) {}

  //?=======================================
  //* @Docs   User can create new Coupon
  //* @Route  POST /api/v1/req-product
  //* @access Private['user']
  //?=======================================
  @Post()
  @Roles(Role.User)
  @UseGuards(AuthGuard, RolesGuard)
  create(
    @Body(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    )
    createReqProductDto: CreateReqProductDto,
    @CurrentUser() user: any,
  ) {
    return this.reqProductService.create(createReqProductDto, user);
  }

  //?=======================================
  //* @Docs   Admin can get all reqProducts & User can get all owned reqProducts
  //* @Route  GET /api/v1/req-product
  //* @access Private['amdin','user']
  //?=======================================
  @Get()
  @Roles(Role.Admin, Role.User)
  @UseGuards(AuthGuard, RolesGuard)
  findAll(@Query() query: GetReqProductsDto, @CurrentUser() user: any) {
    return this.reqProductService.findAll(user,query);
  }

  //?=======================================
  //* @Docs   Admin can get any reqProducts & User can get an owned reqProduct
  //* @Route  GET /api/v1/req-product/:id
  //* @access Private['amdin','user']
  //?=======================================
  @Get(':id')
  @Roles(Role.Admin, Role.User)
  @UseGuards(AuthGuard, RolesGuard)
  findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.reqProductService.findOne(id, user);
  }

  //?=======================================
  //* @Docs   User can update an owned reqProducts only
  //* @Route  PATCH /api/v1/req-product/:id
  //* @access Private['user']
  //?=======================================
  @Patch(':id')
  @Roles(Role.User)
  @UseGuards(AuthGuard, RolesGuard)
  update(
    @Param('id') id: string,
    @Body(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    )
    updateReqProductDto: UpdateReqProductDto,
    @CurrentUser() user: any,
  ) {
    return this.reqProductService.update(id, updateReqProductDto, user);
  }

  //?=======================================
  //* @Docs   User can delete an owned reqProducts only
  //* @Route  DELETE /api/v1/req-product/:id
  //* @access Private['user']
  //?=======================================
  @Delete(':id')
  @Roles(Role.User)
  @UseGuards(AuthGuard, RolesGuard)
  remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.reqProductService.remove(id, user);
  }
}
