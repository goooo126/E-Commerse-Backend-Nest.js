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
import { SupplierResponseDto } from './dto/supplier-response.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  ApiEnvelopeResponse,
  ApiErrors,
  ApiMongoIdParam,
  ApiPrivate,
} from 'src/common/swagger/swagger.helpers';

@ApiTags('Supplier')
@Controller('supplier')
export class SupplierController {
  constructor(private readonly supplierService: SupplierService) {}

  //?=======================================
  //* @Docs   Admin can add new supplier
  //* @Route  POST /api/v1/supplier
  //* @access Private['admin']
  //?=======================================
  @Post()
  @ApiOperation({
    summary: 'Create a supplier',
    description:
      'Creates a new supplier. **Access:** Admin (Bearer token required). The name must be unique (400 otherwise); the website must be a valid URL.',
  })
  @ApiPrivate('admin')
  @ApiEnvelopeResponse({
    status: 201,
    description: 'Supplier created',
    message: 'The Supplier created successfully',
    model: SupplierResponseDto,
  })
  @ApiErrors(400)
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
  @ApiOperation({
    summary: 'List suppliers',
    description:
      'Returns a paginated list of suppliers. Defaults: limit=10, skip=0. **Access:** Public.',
  })
  @ApiEnvelopeResponse({
    status: 200,
    description: 'Paginated suppliers',
    message: 'coupons fetched successfully',
    list: { key: 'suppliers', model: SupplierResponseDto },
  })
  @ApiErrors(400)
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
  @ApiOperation({
    summary: 'Get a supplier by id',
    description:
      'Returns a single supplier. **Access:** Public.',
  })
  @ApiMongoIdParam('id', 'ObjectId of the supplier')
  @ApiEnvelopeResponse({
    status: 200,
    description: 'The supplier',
    message: 'The supplier founded successfully',
    model: SupplierResponseDto,
  })
  @ApiErrors(400, 404)
  findOne(@Param('id') id: string) {
    return this.supplierService.findOne(id);
  }

  //?=======================================
  //* @Docs   Admin can update a supplier
  //* @Route  PATCH /api/v1/supplier/:id
  //* @access Private['amdin']
  //?=======================================
  @Patch(':id')
  @ApiOperation({
    summary: 'Update a supplier',
    description:
      'Partially updates a supplier (all body fields are optional). **Access:** Admin (Bearer token required). A changed name and a changed website must each stay unique (400).',
  })
  @ApiPrivate('admin')
  @ApiMongoIdParam('id', 'ObjectId of the supplier')
  @ApiEnvelopeResponse({
    status: 200,
    description: 'The updated supplier',
    message: 'The supplier updated successfully',
    model: SupplierResponseDto,
  })
  @ApiErrors(400, 404)
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
  @ApiOperation({
    summary: 'Delete a supplier',
    description:
      'Deletes a supplier. **Access:** Admin (Bearer token required). The service returns nothing, so the response has an empty body.',
  })
  @ApiPrivate('admin')
  @ApiMongoIdParam('id', 'ObjectId of the supplier')
  @ApiResponse({
    status: 200,
    description: 'Supplier deleted (empty body)',
  })
  @ApiErrors(400, 404)
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  remove(@Param('id') id: string) {
    return this.supplierService.remove(id);
  }
}
