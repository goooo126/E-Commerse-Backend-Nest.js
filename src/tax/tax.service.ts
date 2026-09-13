import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateTaxDto } from './dto/create-tax.dto';
import { UpdateTaxDto } from './dto/update-tax.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Tax } from './tax.schema';
import { Model } from 'mongoose';

@Injectable()
export class TaxService {
  constructor(@InjectModel(Tax.name) private taxModel: Model<Tax>) {}
  async create(createTaxDto: CreateTaxDto) {
    //* check if the Tax is already existed:
    const existedTax = await this.taxModel.findOne({ name: CreateTaxDto.name });
    if (existedTax) {
      throw new BadRequestException('The Tax is already existed');
    }

    //* create new Tax
    const tax = await this.taxModel.create(createTaxDto);
    return {
      status: 201,
      message: 'Tax created successfully',
      data: tax,
    };
  }

  findAll() {
    return `This action returns all tax`;
  }

  findOne(id: string) {
    return `This action returns a #${id} tax`;
  }

  update(id: string, updateTaxDto: UpdateTaxDto) {
    return `This action updates a #${id} tax`;
  }

  remove(id: string) {
    return `This action removes a #${id} tax`;
  }
}
