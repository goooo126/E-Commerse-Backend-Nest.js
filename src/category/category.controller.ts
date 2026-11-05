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
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Roles } from 'src/user/decorator/roles.decorator';
import { Role } from 'src/user/enums/roles.enum';
import { AuthGuard } from 'src/user/guard/auth.guard';
import { RolesGuard } from 'src/user/guard/role.guard';
import { CategoryResponseDto } from './dto/category-response.dto';
import { SubCategoryRefResponseDto } from 'src/sub-category/dto/sub-category-response.dto';
import { ApiExtraModels, ApiOperation, ApiTags, getSchemaPath } from '@nestjs/swagger';
import {
  ApiEnvelopeResponse,
  ApiErrors,
  ApiMongoIdParam,
  ApiPrivate,
} from 'src/common/swagger/swagger.helpers';

@ApiTags('Category')
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  //?=======================================
  //* @Docs   admin create new category
  //* @Route  POST /api/v1/category
  //* @access Private[admin]
  //?=======================================
  @Post()
  @ApiOperation({
    summary: 'Create a category',
    description:
      'Creates a new category. **Access:** Admin (Bearer token required). The name must be unique (400 if a category with the same name already exists). The optional image must be a valid URL.',
  })
  @ApiPrivate('admin')
  @ApiEnvelopeResponse({
    status: 201,
    description: 'Category created',
    message: 'The category is created successfully :)',
    model: CategoryResponseDto,
  })
  @ApiErrors(400)
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  create(
    @Body(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    )
    createCategoryDto: CreateCategoryDto,
  ) {
    return this.categoryService.create(createCategoryDto);
  }

  //?=======================================
  //* @Docs   any one can get all category
  //* @Route  GET /api/v1/category
  //* @access Public
  //?=======================================
  @Get()
  @ApiOperation({
    summary: 'List all categories',
    description:
      'Returns all categories (no pagination). **Access:** Public.',
  })
  @ApiExtraModels(CategoryResponseDto)
  @ApiEnvelopeResponse({
    status: 200,
    description: 'List of categories',
    message: 'Get All Categories successfully :)',
    data: { type: 'array', items: { $ref: getSchemaPath(CategoryResponseDto) } },
  })
  findAll() {
    return this.categoryService.findAll();
  }

  //?=======================================
  //* @Docs   any one can get all subCategory for category
  //* @Route  GET /api/v1/category/:categoryId/subCategories
  //* @access Public
  //?=======================================
  @Get(':categoryId/subCategories')
  @ApiOperation({
    summary: 'List sub-categories of a category',
    description:
      'Returns all sub-categories that belong to the given category. The response also contains a top-level `length` with the number of sub-categories. **Access:** Public.',
  })
  @ApiMongoIdParam('categoryId', 'ObjectId of the category')
  @ApiExtraModels(SubCategoryRefResponseDto)
  @ApiEnvelopeResponse({
    status: 200,
    description: 'Sub-categories of the category',
    message: 'subCategories founded successfully',
    data: { type: 'array', items: { $ref: getSchemaPath(SubCategoryRefResponseDto) } },
    extra: { length: { type: 'number', example: 3, description: 'Number of sub-categories returned' } },
  })
  @ApiErrors(400, 404)
  findSubCategories(@Param('categoryId') categoryId: string) {
    return this.categoryService.findSubCategories(categoryId);
  }

  //?=======================================
  //* @Docs   any one can get single category
  //* @Route  GET /api/v1/category/:id
  //* @access Public
  //?=======================================
  @Get(':id')
  @ApiOperation({
    summary: 'Get a category by id',
    description:
      'Returns a single category. **Access:** Public.',
  })
  @ApiMongoIdParam('id', 'ObjectId of the category')
  @ApiEnvelopeResponse({
    status: 200,
    description: 'The category',
    message: 'The Category is founed Successfully',
    model: CategoryResponseDto,
  })
  @ApiErrors(400, 404)
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(id);
  }

  //?=======================================
  //* @Docs   Admin can update single category
  //* @Route  PATCH /api/v1/category/:id
  //* @access Private['admin']
  //?=======================================
  @Patch(':id')
  @ApiOperation({
    summary: 'Update a category',
    description:
      'Partially updates a category (all body fields are optional). **Access:** Admin (Bearer token required). Note: the name uniqueness is NOT re-checked on update.',
  })
  @ApiPrivate('admin')
  @ApiMongoIdParam('id', 'ObjectId of the category')
  @ApiEnvelopeResponse({
    status: 200,
    description: 'The updated category',
    message: 'The Category is updated successfully',
    model: CategoryResponseDto,
  })
  @ApiErrors(400, 404)
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
    updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoryService.update(id, updateCategoryDto);
  }

  //?=======================================
  //* @Docs  Admin can delete single category
  //* @Route  DELET /api/v1/category/:id
  //* @access Private ['admin']
  //?=======================================
  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a category',
    description:
      'Deletes a category and also deletes ALL sub-categories that belong to it. **Access:** Admin (Bearer token required). The response contains no data.',
  })
  @ApiPrivate('admin')
  @ApiMongoIdParam('id', 'ObjectId of the category')
  @ApiEnvelopeResponse({
    status: 200,
    description: 'Category (and its sub-categories) deleted',
    message: 'the category is deleted successfully :)',
  })
  @ApiErrors(400, 404)
  @Roles(Role.Admin)
  @UseGuards(AuthGuard,RolesGuard)
  remove(@Param('id') id: string) {
    return this.categoryService.remove(id);
  }
}
