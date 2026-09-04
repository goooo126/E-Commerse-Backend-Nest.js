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
import { BrandService } from './brand.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { Roles } from 'src/user/decorator/roles.decorator';
import { Role } from 'src/user/enums/roles.enum';
import { AuthGuard } from 'src/user/guard/auth.guard';
import { RolesGuard } from 'src/user/guard/role.guard';

@Controller('brand')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  //?=======================================
  //* @Docs   Admin can create new Brand
  //* @Route  POST /api/v1/brand
  //* @access Private['amdin']
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
    createBrandDto: CreateBrandDto,
  ) {
    return this.brandService.create(createBrandDto);
  }

  //?=======================================
  //* @Docs   any user can get all brands
  //* @Route  GET /api/v1/brand
  //* @access Public
  //?=======================================
  @Get()
  findAll() {
    return this.brandService.findAll();
  }

  //?=======================================
  //* @Docs   Any user can get single brand
  //* @Route  Get /api/v1/brand/:id
  //* @access Public
  //?=======================================
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.brandService.findOne(+id);
  }

  //?=======================================
  //* @Docs   Admin can update a Brand
  //* @Route  PATCH /api/v1/brand/:id
  //* @access Private['amdin']
  //?=======================================
  @Patch(':id')
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  update(@Param('id') id: string, @Body() updateBrandDto: UpdateBrandDto) {
    return this.brandService.update(+id, updateBrandDto);
  }

  //?=======================================
  //* @Docs   Admin can Delete a Brand
  //* @Route  DELETE /api/v1/brand/:id
  //* @access Private['amdin']
  //?=======================================
  @Delete(':id')
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  remove(@Param('id') id: string) {
    return this.brandService.remove(+id);
  }
}
