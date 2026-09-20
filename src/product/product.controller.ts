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
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Roles } from 'src/user/decorator/roles.decorator';
import { Role } from 'src/user/enums/roles.enum';
import { AuthGuard } from 'src/user/guard/auth.guard';
import { RolesGuard } from 'src/user/guard/role.guard';
import { GetProductsDto } from './dto/get-products.dto';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  //?=======================================
  //* @Docs   Admin can add new product
  //* @Route  POST /api/v1/product
  //* @access Private['admin']
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
    createProductDto: CreateProductDto,
  ) {
    return this.productService.create(createProductDto);
  }

  //?=======================================
  //* @Docs   Any User can get all reviews for a product
  //* @Route  GET /api/v1/product/id/reviews
  //* @access Public
  //?=======================================
  @Get(':id/reviews')
  findReviewsForProducut(
    @Query(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    )
    query: GetProductsDto,
    @Param('id') id: string,
  ) {
    return this.productService.findReviewsForProducut(id, query);
  }

  //?=======================================
  //* @Docs   Any User can get all products with filters
  //* @Route  GET /api/v1/product
  //* @access Public
  //?=======================================
  @Get()
  findAll(
    @Query(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    )
    query: GetProductsDto,
  ) {
    return this.productService.findAll(query);
  }

  //?=======================================
  //* @Docs   Any User can get a product
  //* @Route  GET /api/v1/product/:id
  //* @access Public
  //?=======================================
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  //?=======================================
  //* @Docs   Admin can update a product
  //* @Route  PATCH /api/v1/product/:id
  //* @access Private['admin']
  //?=======================================
  @Patch(':id')
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  update(
    @Param('id') id: string,
    @Body(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    )
    updateProductDto: UpdateProductDto,
  ) {
    return this.productService.update(id, updateProductDto);
  }

  //?=======================================
  //* @Docs   Admin can Delete a product
  //* @Route  DELETE /api/v1/product/:id
  //* @access Private['admin']
  //?=======================================
  @Delete(':id')
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  remove(@Param('id') id: string) {
    return this.productService.remove(id);
  }
}
