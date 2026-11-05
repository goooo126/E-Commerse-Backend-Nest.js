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
import { TaxService } from './tax.service';
import { CreateTaxDto } from './dto/create-tax.dto';
import { UpdateTaxDto } from './dto/update-tax.dto';
import { Roles } from 'src/user/decorator/roles.decorator';
import { Role } from 'src/user/enums/roles.enum';
import { AuthGuard } from 'src/user/guard/auth.guard';
import { RolesGuard } from 'src/user/guard/role.guard';
import { TaxResponseDto } from './dto/tax-response.dto';
import { ApiExtraModels, ApiOperation, ApiResponse, ApiTags, getSchemaPath } from '@nestjs/swagger';
import {
  ApiEnvelopeResponse,
  ApiErrors,
  ApiMongoIdParam,
  ApiPrivate,
} from 'src/common/swagger/swagger.helpers';

@ApiTags('Tax')
@Controller('tax')
export class TaxController {
  constructor(private readonly taxService: TaxService) {}

  //?=======================================
  //* @Docs   Admin can add new Tax
  //* @Route  POST /api/v1/tax
  //* @access Private['admin']
  //?=======================================
  @Post()
  @ApiOperation({
    summary: 'Create a tax',
    description:
      'Creates a new tax entry. **Access:** Admin (Bearer token required). The name must be unique (400 otherwise). The order flow reads the entries named "productTax" and "shippingTax" and adds their `price` to the order total.',
  })
  @ApiPrivate('admin')
  @ApiEnvelopeResponse({
    status: 201,
    description: 'Tax created',
    message: 'Tax created successfully',
    model: TaxResponseDto,
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
    createTaxDto: CreateTaxDto,
  ) {
    return this.taxService.create(createTaxDto);
  }

  //?=======================================
  //* @Docs   Admin can get all Tax
  //* @Route  GET /api/v1/tax
  //* @access Private['admin']
  //?=======================================
  @Get()
  @ApiOperation({
    summary: 'List all taxes',
    description:
      'Returns all tax entries (no pagination). **Access:** Admin (Bearer token required).',
  })
  @ApiPrivate('admin')
  @ApiExtraModels(TaxResponseDto)
  @ApiEnvelopeResponse({
    status: 200,
    description: 'List of taxes',
    message: 'tax is fetched successfully',
    data: { type: 'array', items: { $ref: getSchemaPath(TaxResponseDto) } },
  })
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  findAll() {
    return this.taxService.findAll();
  }

  //?=======================================
  //* @Docs   Admin can geg single Tax
  //* @Route  GET /api/v1/tax/:id
  //* @access Private['admin']
  //?=======================================
  @Get(':id')
  @ApiOperation({
    summary: 'Get a tax by id',
    description:
      'Returns a single tax entry. **Access:** Admin (Bearer token required).',
  })
  @ApiPrivate('admin')
  @ApiMongoIdParam('id', 'ObjectId of the tax')
  @ApiEnvelopeResponse({
    status: 200,
    description: 'The tax',
    message: 'The Tax is founded successfully',
    model: TaxResponseDto,
  })
  @ApiErrors(400, 404)
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  findOne(@Param('id') id: string) {
    return this.taxService.findOne(id);
  }

  //?=======================================
  //* @Docs   Admin can update a Tax
  //* @Route  PATCH /api/v1/tax/:id
  //* @access Private['admin']
  //?=======================================
  @Patch(':id')
  @ApiOperation({
    summary: 'Update a tax',
    description:
      'Partially updates a tax entry (all body fields are optional). **Access:** Admin (Bearer token required). A changed name must stay unique (400).',
  })
  @ApiPrivate('admin')
  @ApiMongoIdParam('id', 'ObjectId of the tax')
  @ApiEnvelopeResponse({
    status: 200,
    description: 'The updated tax',
    message: 'The Tax is updated successfully',
    model: TaxResponseDto,
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
    updateTaxDto: UpdateTaxDto,
  ) {
    return this.taxService.update(id, updateTaxDto);
  }

  //?=======================================
  //* @Docs   Admin can delete a Tax
  //* @Route  DELETE /api/v1/tax/:id
  //* @access Private['admin']
  //?=======================================
  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a tax',
    description:
      'Deletes a tax entry. **Access:** Admin (Bearer token required). The service returns nothing, so the response has an empty body.',
  })
  @ApiPrivate('admin')
  @ApiMongoIdParam('id', 'ObjectId of the tax')
  @ApiResponse({
    status: 200,
    description: 'Tax deleted (empty body)',
  })
  @ApiErrors(400, 404)
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  remove(@Param('id') id: string) {
    return this.taxService.remove(id);
  }
}
