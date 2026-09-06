import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ReqProductService } from './req-product.service';
import { CreateReqProductDto } from './dto/create-req-product.dto';
import { UpdateReqProductDto } from './dto/update-req-product.dto';

@Controller('req-product')
export class ReqProductController {
  constructor(private readonly reqProductService: ReqProductService) {}

  @Post()
  create(@Body() createReqProductDto: CreateReqProductDto) {
    return this.reqProductService.create(createReqProductDto);
  }

  @Get()
  findAll() {
    return this.reqProductService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reqProductService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateReqProductDto: UpdateReqProductDto) {
    return this.reqProductService.update(+id, updateReqProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reqProductService.remove(+id);
  }
}
