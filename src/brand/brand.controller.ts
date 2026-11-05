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
import { BrandService } from './brand.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { Roles } from 'src/user/decorator/roles.decorator';
import { Role } from 'src/user/enums/roles.enum';
import { AuthGuard } from 'src/user/guard/auth.guard';
import { RolesGuard } from 'src/user/guard/role.guard';
import { GetBrandsDto } from './dto/get-brands-dto';
import { BrandResponseDto } from './dto/brand-response.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  ApiEnvelopeResponse,
  ApiErrors,
  ApiMongoIdParam,
  ApiPrivate,
} from 'src/common/swagger/swagger.helpers';

@ApiTags('Brand')
@Controller('brand')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  //?=======================================
  //* @Docs   Admin can create new Brand
  //* @Route  POST /api/v1/brand
  //* @access Private['amdin']
  //?=======================================
  @Post()
  @ApiOperation({
    summary: 'Create a brand',
    description:
      'Creates a new brand. **Access:** Admin (Bearer token required). The name must be unique (400 otherwise). The optional URL is sent in the `email` property (despite its name it must be a valid URL). Known quirk: the service responds with HTTP 201 but the JSON body `status` is 200, and `data` is a boolean (result of `isSelected`) instead of the created brand.',
  })
  @ApiPrivate('admin')
  @ApiEnvelopeResponse({
    status: 201,
    bodyStatus: 200,
    description: 'Brand created. Note: `data` is a boolean, not the brand document',
    message: 'The Brand created Successfully :)',
    data: { type: 'boolean', example: true, description: 'Result of `isSelected("-__V")`, not the created brand' },
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
  @ApiOperation({
    summary: 'List brands',
    description:
      'Returns a paginated list of brands. Defaults: limit=10, skip=0. **Access:** Public.',
  })
  @ApiEnvelopeResponse({
    status: 200,
    description: 'Paginated brands',
    message: 'Brands fetched successfully',
    list: { key: 'brands', model: BrandResponseDto },
  })
  @ApiErrors(400)
  findAll(@Query(new ValidationPipe({
    whitelist: true,
    transform: true,
  }),) query:GetBrandsDto) {
    return this.brandService.findAll(query);
  }

  //?=======================================
  //* @Docs   Any user can get single brand
  //* @Route  Get /api/v1/brand/:id
  //* @access Public
  //?=======================================
  @Get(':id')
  @ApiOperation({
    summary: 'Get a brand by id',
    description:
      'Returns a single brand. **Access:** Public.',
  })
  @ApiMongoIdParam('id', 'ObjectId of the brand')
  @ApiEnvelopeResponse({
    status: 200,
    description: 'The brand',
    message: 'The Brand founded successfully',
    model: BrandResponseDto,
  })
  @ApiErrors(400, 404)
  findOne(@Param('id') id: string) {
    return this.brandService.findOne(id);
  }

  //?=======================================
  //* @Docs   Admin can update a Brand
  //* @Route  PATCH /api/v1/brand/:id
  //* @access Private['amdin']
  //?=======================================
  @Patch(':id')
  @ApiOperation({
    summary: 'Update a brand',
    description:
      'Partially updates a brand (all body fields are optional). **Access:** Admin (Bearer token required). A changed name must stay unique (400). The URL is sent in the `email` property (it is a URL despite the name).',
  })
  @ApiPrivate('admin')
  @ApiMongoIdParam('id', 'ObjectId of the brand')
  @ApiEnvelopeResponse({
    status: 200,
    description: 'The updated brand',
    message: 'The brand is updated successfully',
    model: BrandResponseDto,
  })
  @ApiErrors(400, 404)
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  update(@Param('id') id: string, @Body(new ValidationPipe({
    whitelist: true,
    transform: true,
  }),) updateBrandDto: UpdateBrandDto) {
    return this.brandService.update(id, updateBrandDto);
  }

  //?=======================================
  //* @Docs   Admin can Delete a Brand
  //* @Route  DELETE /api/v1/brand/:id
  //* @access Private['amdin']
  //?=======================================
  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a brand',
    description:
      'Deletes a brand. **Access:** Admin (Bearer token required). The response contains no data.',
  })
  @ApiPrivate('admin')
  @ApiMongoIdParam('id', 'ObjectId of the brand')
  @ApiEnvelopeResponse({
    status: 200,
    description: 'Brand deleted',
    message: 'The Brand is delete successfully :(',
  })
  @ApiErrors(400, 404)
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  remove(@Param('id') id: string) {
    return this.brandService.remove(id);
  }
}
