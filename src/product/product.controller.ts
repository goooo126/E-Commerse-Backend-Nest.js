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
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  ApiEnvelopeResponse,
  ApiErrors,
  ApiMongoIdParam,
  ApiPrivate,
} from 'src/common/swagger/swagger.helpers';
import { ProductResponseDto } from './dto/product-response.dto';
import { ReviewResponseDto } from 'src/review/dto/review-response.dto';

@ApiTags('Product')
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  //?=======================================
  //* @Docs   Admin can add new product
  //* @Route  POST /api/v1/product
  //* @access Private['admin']
  //?=======================================
  @ApiOperation({
    summary: 'Create a product',
    description:
      'Creates a product. **Access:** Admin. The title must be unique (400 otherwise), the category must exist (404), and the optional subCategory (must belong to the category) and brand must exist (404). The response body contains the misspelled key `stauts` (instead of `status`); category/subCategory/brand are returned as ids (not populated).',
  })
  @ApiPrivate('admin')
  @ApiEnvelopeResponse({
    status: 201,
    noStatus: true,
    description: 'Product created',
    message: 'The product is created successfully',
    model: ProductResponseDto,
    extra: { stauts: { type: 'number', example: 201 } },
  })
  @ApiErrors(
    [400, 'Validation failed, or a product with the same title already exists'],
    [404, 'Category not found, subCategory not found / not in the category, or brand not found'],
  )
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
  @ApiTags('Product', 'Review')
  @ApiOperation({
    summary: 'List reviews of a product',
    description:
      'Returns the reviews written for a product. **Access:** Public. The query reuses GetProductsDto but only `limit` (default 10) and `skip` (default 0) are used; no sorting is applied and the reviewer is not populated.',
  })
  @ApiMongoIdParam('id', 'Product ObjectId')
  @ApiEnvelopeResponse({
    description: 'Reviews fetched',
    message: 'reviews fetched successfully',
    bodyStatus: 200,
    list: { key: 'reviews', model: ReviewResponseDto },
  })
  @ApiErrors([400, 'Invalid ObjectId or invalid query parameters'], [404, 'Product not found'])
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
  @ApiOperation({
    summary: 'List products',
    description:
      'Returns a paginated list of products. **Access:** Public. Applied filters: title (case-insensitive regex), category, subCategory, brand, minPrice/maxPrice (inclusive). Defaults: limit 10, skip 0, sort createdAt ascending. `sort` accepts any product field and `order` any value other than `asc` sorts descending. `search`, `minRating`, `inStock` and `isActive` are accepted but currently ignored. category, subCategory and brand are populated with only their `name`.',
  })
  @ApiEnvelopeResponse({
    description: 'Products fetched',
    message: 'products fetched successfully',
    bodyStatus: 200,
    list: { key: 'products', model: ProductResponseDto },
  })
  @ApiErrors([400, 'Invalid query parameters (e.g. malformed category ObjectId)'])
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
  @ApiOperation({
    summary: 'Get a product by id',
    description:
      'Returns a single product with category, subCategory and brand populated (name only). **Access:** Public. The response body contains the misspelled key `stauts` (instead of `status`).',
  })
  @ApiMongoIdParam('id', 'Product ObjectId')
  @ApiEnvelopeResponse({
    noStatus: true,
    description: 'Product found',
    message: 'The product founded successfully',
    model: ProductResponseDto,
    extra: { stauts: { type: 'number', example: 200 } },
  })
  @ApiErrors([400, 'Invalid ObjectId'], [404, 'Product not found'])
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  //?=======================================
  //* @Docs   Admin can update a product
  //* @Route  PATCH /api/v1/product/:id
  //* @access Private['admin']
  //?=======================================
  @ApiOperation({
    summary: 'Update a product',
    description:
      'Partially updates a product (all body fields optional). **Access:** Admin. A new title must be unique; changing the category requires sending a subCategory as well (400); category, subCategory (must belong to the category) and brand must exist (404). The response body contains the misspelled key `stauts` (instead of `status`).',
  })
  @ApiPrivate('admin')
  @ApiMongoIdParam('id', 'Product ObjectId')
  @ApiEnvelopeResponse({
    noStatus: true,
    description: 'Product updated',
    message: 'Product updated',
    model: ProductResponseDto,
    extra: { stauts: { type: 'number', example: 200 } },
  })
  @ApiErrors(
    [400, 'Validation failed, invalid ObjectId, duplicate title, or category changed without a subCategory'],
    [404, 'Product, category, subCategory (or not in the category) or brand not found'],
  )
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
  @ApiOperation({
    summary: 'Delete a product',
    description:
      'Deletes a product and, in the same transaction, all reviews written for it. **Access:** Admin. Returns HTTP 200 with an empty body.',
  })
  @ApiPrivate('admin')
  @ApiMongoIdParam('id', 'Product ObjectId')
  @ApiResponse({ status: 200, description: 'Product and its reviews deleted (empty body)' })
  @ApiErrors([400, 'Invalid ObjectId'], [404, 'Product not found'])
  @Delete(':id')
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  remove(@Param('id') id: string) {
    return this.productService.remove(id);
  }
}
