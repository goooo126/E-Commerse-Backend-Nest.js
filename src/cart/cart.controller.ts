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
} from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { Roles } from 'src/user/decorator/roles.decorator';
import { Role } from 'src/user/enums/roles.enum';
import { AuthGuard } from 'src/user/guard/auth.guard';
import { RolesGuard } from 'src/user/guard/role.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  //?=======================================
  //* @Docs   Only User can create or add product to his cart
  //* @Route  POST /api/v1/product/cart
  //* @access Private(['user'])
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
    createCartDto: CreateCartDto,
    @CurrentUser() user,
  ) {
    return this.cartService.create(createCartDto, user);
  }

  //?=======================================
  //* @Docs   Admin can get all carts
  //* @Route  GET /api/v1/product/cart
  //* @access Private(['admin'])
  //?=======================================
  @Get()
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  findAll() {
    return this.cartService.findAll();
  }

  //?=======================================
  //* @Docs   Admin can get single cart or user get his cart
  //* @Route  GET /api/v1/product/cart/:id
  //* @access Private(['admin','user'])
  //?=======================================
  @Get(':id')
  @Roles(Role.Admin, Role.User)
  @UseGuards(AuthGuard, RolesGuard)
  findOne(@Param('id') id: string, @CurrentUser() user) {
    return this.cartService.findOne(id, user);
  }

  //?=======================================
  //* @Docs   User can update his cart
  //* @Route  PATCH /api/v1/product/cart/:id
  //* @access Private(['user'])
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
    updateCartDto: UpdateCartDto,
    @CurrentUser() user,
  ) {
    return this.cartService.update(id, updateCartDto, user);
  }

  //?=======================================
  //* @Docs   User can delete his cart
  //* @Route  DELETE /api/v1/product/cart/:id
  //* @access Private(['user'])
  //?=======================================
  @Delete(':id')
  @Roles(Role.User)
  @UseGuards(AuthGuard, RolesGuard)
  remove(@Param('id') id: string, @CurrentUser() user) {
    return this.cartService.remove(id, user);
  }
}
