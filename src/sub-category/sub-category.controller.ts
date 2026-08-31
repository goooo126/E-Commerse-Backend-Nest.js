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

  @Get()
  findAll() {
    return this.subCategoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.subCategoryService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSubCategoryDto: UpdateSubCategoryDto,
  ) {
    return this.subCategoryService.update(+id, updateSubCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.subCategoryService.remove(+id);
  }
}
