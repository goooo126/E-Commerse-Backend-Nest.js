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

@Controller('sub-category')
export class SubCategoryController {
  constructor(private readonly subCategoryService: SubCategoryService) {}

  //?=======================================
  //* @Docs   Admin can add sub category
  //* @Route  POST /api/v1/sub-category
  //* @access Private['admin']
  //?=======================================
  @Post()
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
  findAll() {
    return this.subCategoryService.findAll();
  }

  //?=======================================
  //* @Docs   Any user can get single subCategory
  //* @Route  GET /api/v1/sub-category/:id
  //* @access Public
  //?=======================================
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.subCategoryService.findOne(id);
  }


  //?=======================================
  //* @Docs   Admin can update a subCategory
  //* @Route  PATCH /api/v1/sub-category/:id
  //* @access Private['Admin']
  //?=======================================
  @Patch(':id')
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
  @Roles(Role.Admin)
  @UseGuards(AuthGuard,RolesGuard)
  remove(@Param('id') id: string) {
    return this.subCategoryService.remove(id);
  }
}
