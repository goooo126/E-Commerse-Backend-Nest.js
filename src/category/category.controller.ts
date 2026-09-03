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

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  //?=======================================
  //* @Docs   admin create new category
  //* @Route  POST /api/v1/category
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
  findAll() {
    return this.categoryService.findAll();
  }

  //?=======================================
  //* @Docs   any one can get all subCategory for category
  //* @Route  GET /api/v1/category/:categoryId/subCategories
  //* @access Public
  //?=======================================
  @Get(':categoryId/subCategories')
  findSubCategories(@Param('categoryId') categoryId: string) {
    return this.categoryService.findSubCategories(categoryId);
  }

  //?=======================================
  //* @Docs   any one can get single category
  //* @Route  GET /api/v1/category/:id
  //* @access Public
  //?=======================================
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(id);
  }

  //?=======================================
  //* @Docs   Admin can update single category
  //* @Route  PATCH /api/v1/category/:id
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
  @Roles(Role.Admin)
  @UseGuards(AuthGuard,RolesGuard)
  remove(@Param('id') id: string) {
    return this.categoryService.remove(id);
  }
}
