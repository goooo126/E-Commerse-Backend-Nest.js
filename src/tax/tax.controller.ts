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

@Controller('tax')
export class TaxController {
  constructor(private readonly taxService: TaxService) {}

  //?=======================================
  //* @Docs   Admin can add new Tax
  //* @Route  POST /api/v1/tax
  //* @access Private['admin']
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
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  remove(@Param('id') id: string) {
    return this.taxService.remove(id);
  }
}
