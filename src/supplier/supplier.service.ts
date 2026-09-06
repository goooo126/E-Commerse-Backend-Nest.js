import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Supplier } from './supplier.schema';
import mongoose, { Model } from 'mongoose';
import { GetSupplierDto } from './dto/get-supplier.dto';

@Injectable()
export class SupplierService {
  constructor(
    @InjectModel(Supplier.name) private supplierModel: Model<Supplier>,
  ) {}

  
  async create(createSupplierDto: CreateSupplierDto) {
    //* check if the supplier name is existed already:
    const existedSupplier = await this.supplierModel.findOne({
      name: createSupplierDto.name,
    });
    if (existedSupplier) {
      throw new BadRequestException('The supplier name is already existed');
    }

    const newSupplier = await this.supplierModel.create(createSupplierDto);
    return {
      status: 201,
      message: 'The Supplier created successfully',
      data: newSupplier,
    };
  }

  async findAll(query: GetSupplierDto) {
    const { limit = 10, skip = 0 } = query;
    const [suppliers, total] = await Promise.all([
      this.supplierModel.find().select('-__v').skip(skip).limit(limit),
      this.supplierModel.countDocuments(),
    ]);
    return {
      status: 200,
      message: 'coupons fetched successfully',
      data: {
        suppliers,
        pagination: {
          total,
          limit,
          skip,
          returned: suppliers.length,
        },
      },
    };
  }

  async findOne(id: string) {
    //* check if the id is valid id:
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('The must be valid id');
    }

    //* check if the supplier is existed:
    const supplier = await this.supplierModel.findById(id).select('-__v');
    if (!supplier) {
      throw new NotFoundException('The supplier is not founded');
    }

    return {
      status: 200,
      message: 'The supplier founded successfully',
      data: supplier,
    };
  }

  async update(id: string, updateSupplierDto: UpdateSupplierDto) {
    //* check if the id is valid id:
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('The must be valid id');
    }

    //* check if the supplier is existed:
    const supplier = await this.supplierModel.findById(id).select('-__v');
    if (!supplier) {
      throw new NotFoundException('The supplier is not founded');
    }

    //* if name is changed check that there is not existed:
    if (updateSupplierDto.name) {
      const existedSupplier = await this.supplierModel.findOne({
        name: updateSupplierDto.name,
        _id: { $ne: id },
      });

      if (existedSupplier) {
        throw new BadRequestException('The supplier name is already existed');
      }
    }

    //* if website is changed check that there is not existed:
    if (updateSupplierDto.website) {
      const existedSupplier = await this.supplierModel.findOne({
        website: updateSupplierDto.website,
        _id: { $ne: id },
      });

      if (existedSupplier) {
        throw new BadRequestException(
          'The supplier website is already existed',
        );
      }
    }

    const updatedSupplier = await this.supplierModel.findByIdAndUpdate(
      id,
      updateSupplierDto,
      { new: true, fields: '-__v' },
    );

    return {
      status: 200,
      message: 'The supplier updated successfully',
      data: updatedSupplier,
    };
  }

  async remove(id: string): Promise<void> {
    //* check if the id is valid id:
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('The must be valid id');
    }

    //* check if the supplier is existed:
    const supplier = await this.supplierModel.findById(id).select('-__v');
    if (!supplier) {
      throw new NotFoundException('The supplier is not founded');
    }

    await this.supplierModel.findByIdAndDelete(id);
  }
}
