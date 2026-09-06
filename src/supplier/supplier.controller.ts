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
import { SupplierService } from './supplier.service';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { Roles } from 'src/user/decorator/roles.decorator';
import { Role } from 'src/user/enums/roles.enum';
import { AuthGuard } from 'src/user/guard/auth.guard';
import { RolesGuard } from 'src/user/guard/role.guard';
import { GetSupplierDto } from './dto/get-supplier.dto';

@Controller('supplier')
export class SupplierController {
  constructor(private readonly supplierService: SupplierService) {}

  //?=======================================
  //* @Docs   Admin can add new supplier
  //* @Route  POST /api/v1/supplier
  //* @access Private['admin']
  //?=======================================
  @Post()
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  create(@Body(new ValidationPipe({
    whitelist: true,
    transform: true,
  }),) createSupplierDto: CreateSupplierDto) {
    return this.supplierService.create(createSupplierDto);
  }

  //?=======================================
  //* @Docs   any user can get all suppliers
  //* @Route  GET /api/v1/supplier
  //* @access Public
  //?=======================================
  @Get()
  findAll(@Query(new ValidationPipe({
    whitelist: true,
    transform: true,
  }),) query:GetSupplierDto) {
    return this.supplierService.findAll(query);
  }

  //?=======================================
  //* @Docs   any user can get a supplier
  //* @Route  GET /api/v1/supplier/:id
  //* @access Public
  //?=======================================
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.supplierService.findOne(id);
  }

  //?=======================================
  //* @Docs   Admin can update a supplier
  //* @Route  PATCH /api/v1/supplier/:id
  //* @access Private['amdin']
  //?=======================================
  @Patch(':id')
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  update(
    @Param('id') id: string,
    @Body(new ValidationPipe({
      whitelist: true,
      transform: true,
    }),) updateSupplierDto: UpdateSupplierDto,
  ) {
    return this.supplierService.update(id, updateSupplierDto);
  }

  //?=======================================
  //* @Docs   Admin can delete a supplier
  //* @Route  DELETE /api/v1/supplier/:id
  //* @access Private['amdin']
  //?=======================================
  @Delete(':id')
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  remove(@Param('id') id: string) {
    return this.supplierService.remove(id);
  }
}
