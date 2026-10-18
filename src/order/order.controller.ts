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
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Roles } from 'src/user/decorator/roles.decorator';
import { Role } from 'src/user/enums/roles.enum';
import { AuthGuard } from 'src/user/guard/auth.guard';
import { RolesGuard } from 'src/user/guard/role.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { GetOrderDto } from './dto/get-order.dto';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  //?=======================================
  //* @Docs   User can create new order
  //* @Route  POST /api/v1/order
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
    createOrderDto: CreateOrderDto,
    @CurrentUser() user: any,
  ) {
    return this.orderService.create(createOrderDto, user);
  }

  //?=======================================
  //* @Docs   User can get all his/her orders, admin can get all orders
  //* @Route  GET /api/v1/order
  //* @access Private['user','admin']
  //?=======================================
  @Get()
  @Roles(Role.Admin, Role.User)
  @UseGuards(AuthGuard, RolesGuard)
  findAll(
    @CurrentUser() user: any,
    @Query(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    )
    query: GetOrderDto,
  ) {
    return this.orderService.findAll(user,query);
  }

  //?=======================================
  //* @Docs   User can get  his/her order, admin can get any order
  //* @Route  GET /api/v1/order/:id
  //* @access Private['user','admin']
  //?=======================================
  @Get(':id')
  @Roles(Role.Admin, Role.User)
  @UseGuards(AuthGuard, RolesGuard)
  findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.orderService.findOne(id, user);
  }

  //?=======================================
  //* @Docs   admin can update the order only
  //* @Route  PATCH /api/v1/order/:id/status
  //* @access Private['admin']
  //?=======================================
  @Patch(':id/status')
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  updateStatus(
    @Param('id') id: string,
    @Body(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    )
    updateOrderDto: UpdateOrderDto,
    @CurrentUser() user: any,
  ) {
    return this.orderService.updateStatus(id, updateOrderDto, user);
  }

  //?=======================================
  //* @Docs   User can delete the order
  //* @Route  DELETE /api/v1/order/:id
  //* @access Private['user']
  //?=======================================
  @Delete(':id')
  @Roles(Role.User)
  @UseGuards(AuthGuard, RolesGuard)
  remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.orderService.remove(id, user);
  }
}
