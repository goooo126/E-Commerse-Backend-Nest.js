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
import { SubCategoryService } from './sub-category.service';
import { CreateSubCategoryDto } from './dto/create-sub-category.dto';
import { UpdateSubCategoryDto } from './dto/update-sub-category.dto';
import { Role } from 'src/user/enums/roles.enum';
import { Roles } from 'src/user/decorator/roles.decorator';
import { AuthGuard } from 'src/user/guard/auth.guard';
import { RolesGuard } from 'src/user/guard/role.guard';
import { SubCategoryResponseDto } from './dto/sub-category-response.dto';
import { ApiExtraModels, ApiOperation, ApiTags, getSchemaPath } from '@nestjs/swagger';
import {
  ApiEnvelopeResponse,
  ApiErrors,
  ApiMongoIdParam,
  ApiPrivate,
} from 'src/common/swagger/swagger.helpers';

@ApiTags('Sub-category')
@Controller('sub-category')
export class SubCategoryController {
  constructor(private readonly subCategoryService: SubCategoryService) {}

  //?=======================================
  //* @Docs   Admin can add sub category
  //* @Route  POST /api/v1/sub-category
  //* @access Private['admin']
  //?=======================================
  @Post()
  @ApiOperation({
    summary: 'Create a sub-category',
    description:
      'Creates a sub-category under an existing category. **Access:** Admin (Bearer token required). The name must be unique across all sub-categories (400 otherwise); the `category` ObjectId must be valid (400) and must exist (404). The parent category is returned populated.',
  })
  @ApiPrivate('admin')
  @ApiEnvelopeResponse({
    status: 201,
    description: 'Sub-category created',
    message: 'the subCategory is created successfully :)',
    model: SubCategoryResponseDto,
  })
  @ApiErrors(400, 404)
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  create(@Body(new ValidationPipe({
    whitelist: true,
    transform: true,
  }),) createSubCategoryDto: CreateSubCategoryDto) {
    return this.subCategoryService.create(createSubCategoryDto);
  }

  //?=======================================
  //* @Docs   Any user can get all subCategories
  //* @Route  GET /api/v1/sub-category
  //* @access Public
  //?=======================================
  @Get()
  @ApiOperation({
    summary: 'List all sub-categories',
    description:
      'Returns all sub-categories with their parent category populated. The response also contains a top-level `length`. **Access:** Public.',
  })
  @ApiExtraModels(SubCategoryResponseDto)
  @ApiEnvelopeResponse({
    status: 200,
    description: 'List of sub-categories',
    message: 'All Sub Categories founded successfully',
    data: { type: 'array', items: { $ref: getSchemaPath(SubCategoryResponseDto) } },
    extra: { length: { type: 'number', example: 5, description: 'Number of sub-categories returned' } },
  })
  findAll() {
    return this.subCategoryService.findAll();
  }

  //?=======================================
  //* @Docs   Any user can get single subCategory
  //* @Route  GET /api/v1/sub-category/:id
  //* @access Public
  //?=======================================
  @Get(':id')
  @ApiOperation({
    summary: 'Get a sub-category by id',
    description:
      'Returns a single sub-category with its parent category populated. **Access:** Public.',
  })
  @ApiMongoIdParam('id', 'ObjectId of the sub-category')
  @ApiEnvelopeResponse({
    status: 200,
    description: 'The sub-category',
    message: 'The subCategory is founded successfully :)',
    model: SubCategoryResponseDto,
  })
  @ApiErrors(400, 404)
  findOne(@Param('id') id: string) {
    return this.subCategoryService.findOne(id);
  }


  //?=======================================
  //* @Docs   Admin can update a subCategory
  //* @Route  PATCH /api/v1/sub-category/:id
  //* @access Private['Admin']
  //?=======================================
  @Patch(':id')
  @ApiOperation({
    summary: 'Update a sub-category',
    description:
      'Partially updates a sub-category (all body fields are optional). **Access:** Admin (Bearer token required). A changed name must stay unique (400); a changed `category` must be a valid ObjectId (400) of an existing category (404).',
  })
  @ApiPrivate('admin')
  @ApiMongoIdParam('id', 'ObjectId of the sub-category')
  @ApiEnvelopeResponse({
    status: 200,
    description: 'The updated sub-category',
    message: 'The subCategory is updated successfuly :)',
    model: SubCategoryResponseDto,
  })
  @ApiErrors(400, 404)
  @Roles(Role.Admin)
  @UseGuards(AuthGuard,RolesGuard)
  update(
    @Param('id') id: string,
    @Body(new ValidationPipe({
      whitelist: true,
      transform: true,
    }),) updateSubCategoryDto: UpdateSubCategoryDto,
  ) {
    return this.subCategoryService.update(id, updateSubCategoryDto);
  }

  //?=======================================
  //* @Docs   Admin can Delete a subCategory
  //* @Route  DELETE /api/v1/sub-category/:id
  //* @access Private['Admin']
  //?=======================================
  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a sub-category',
    description:
      'Deletes a sub-category. **Access:** Admin (Bearer token required). The response contains no data.',
  })
  @ApiPrivate('admin')
  @ApiMongoIdParam('id', 'ObjectId of the sub-category')
  @ApiEnvelopeResponse({
    status: 200,
    description: 'Sub-category deleted',
    message: 'Subcategory is deleted Successfully :)',
  })
  @ApiErrors(400, 404)
  @Roles(Role.Admin)
  @UseGuards(AuthGuard,RolesGuard)
  remove(@Param('id') id: string) {
    return this.subCategoryService.remove(id);
  }
}
