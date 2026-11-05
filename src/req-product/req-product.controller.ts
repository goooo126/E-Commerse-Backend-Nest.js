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
import { ReqProductService } from './req-product.service';
import { CreateReqProductDto } from './dto/create-req-product.dto';
import { UpdateReqProductDto } from './dto/update-req-product.dto';
import { Role } from 'src/user/enums/roles.enum';
import { Roles } from 'src/user/decorator/roles.decorator';
import { AuthGuard } from 'src/user/guard/auth.guard';
import { RolesGuard } from 'src/user/guard/role.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { GetReqProductsDto } from './dto/get-reqProducts.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  ApiEnvelopeResponse,
  ApiErrors,
  ApiMongoIdParam,
  ApiPrivate,
} from 'src/common/swagger/swagger.helpers';
import { ReqProductResponseDto } from './dto/req-product-response.dto';

@ApiTags('Request product')
@Controller('req-product')
export class ReqProductController {
  constructor(private readonly reqProductService: ReqProductService) {}

  //?=======================================
  //* @Docs   User can create new Coupon
  //* @Route  POST /api/v1/req-product
  //* @access Private['user']
  //?=======================================
  @ApiOperation({
    summary: 'Create a product request',
    description:
      'A user asks the store to stock an item. **Access:** User. A user cannot create two requests with the same titleName (400). The requester is returned populated (name, email).',
  })
  @ApiPrivate('user')
  @ApiEnvelopeResponse({
    status: 201,
    bodyStatus: 201,
    description: 'Request created',
    message: 'The Request product created successfully',
    model: ReqProductResponseDto,
  })
  @ApiErrors([400, 'Validation failed, or the user already requested a product with this titleName'])
  @Post()
  @Roles(Role.User)
  @UseGuards(AuthGuard, RolesGuard)
  create(
    @Body(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    )
    createReqProductDto: CreateReqProductDto,
    @CurrentUser() user: any,
  ) {
    return this.reqProductService.create(createReqProductDto, user);
  }

  //?=======================================
  //* @Docs   Admin can get all reqProducts & User can get all owned reqProducts
  //* @Route  GET /api/v1/req-product
  //* @access Private['amdin','user']
  //?=======================================
  @ApiOperation({
    summary: 'List product requests',
    description:
      'Returns a paginated list of product requests. **Access:** User & Admin. Admins see all requests (with the requester populated: name, email); users see only their own. Defaults: limit 10, skip 0. Query values are not validated by a ValidationPipe on this route.',
  })
  @ApiPrivate('admin', 'user')
  @ApiEnvelopeResponse({
    description: 'Requests fetched',
    message: 'The reqProducts fetchs successfully',
    bodyStatus: 200,
    list: { key: 'reqProducts', model: ReqProductResponseDto },
  })
  @Get()
  @Roles(Role.Admin, Role.User)
  @UseGuards(AuthGuard, RolesGuard)
  findAll(@Query() query: GetReqProductsDto, @CurrentUser() user: any) {
    return this.reqProductService.findAll(user,query);
  }

  //?=======================================
  //* @Docs   Admin can get any reqProducts & User can get an owned reqProduct
  //* @Route  GET /api/v1/req-product/:id
  //* @access Private['amdin','user']
  //?=======================================
  @ApiOperation({
    summary: 'Get a product request by id',
    description:
      'Returns a single product request with the requester populated (name, email). **Access:** User & Admin. Admins can read any request; users only their own (401 otherwise).',
  })
  @ApiPrivate('admin', 'user')
  @ApiMongoIdParam('id', 'Request ObjectId')
  @ApiEnvelopeResponse({
    description: 'Request found',
    message: 'The Request Product founded successfully',
    model: ReqProductResponseDto,
  })
  @ApiErrors(
    [400, 'Invalid ObjectId'],
    [401, 'Missing/invalid token, or the request does not belong to the user'],
    [404, 'Request not found'],
  )
  @Get(':id')
  @Roles(Role.Admin, Role.User)
  @UseGuards(AuthGuard, RolesGuard)
  findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.reqProductService.findOne(id, user);
  }

  //?=======================================
  //* @Docs   User can update an owned reqProducts only
  //* @Route  PATCH /api/v1/req-product/:id
  //* @access Private['user']
  //?=======================================
  @ApiOperation({
    summary: 'Update own product request',
    description:
      'Partially updates a product request (all body fields optional). **Access:** User (owner only). The new titleName must not be used by another request (400).',
  })
  @ApiPrivate('user')
  @ApiMongoIdParam('id', 'Request ObjectId')
  @ApiEnvelopeResponse({
    description: 'Request updated',
    message: 'The Request Product updated successfully',
    model: ReqProductResponseDto,
  })
  @ApiErrors(
    [400, 'Validation failed, invalid ObjectId, or another request already uses this titleName'],
    [401, 'Missing/invalid token, role not allowed, or the request does not belong to the user'],
    [404, 'Request not found'],
  )
  @Patch(':id')
  @Roles(Role.User)
  @UseGuards(AuthGuard, RolesGuard)
  update(
    @Param('id') id: string,
    @Body(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    )
    updateReqProductDto: UpdateReqProductDto,
    @CurrentUser() user: any,
  ) {
    return this.reqProductService.update(id, updateReqProductDto, user);
  }

  //?=======================================
  //* @Docs   User can delete an owned reqProducts only
  //* @Route  DELETE /api/v1/req-product/:id
  //* @access Private['user']
  //?=======================================
  @ApiOperation({
    summary: 'Delete own product request',
    description: 'Deletes a product request. **Access:** User (owner only). Returns HTTP 200 with an empty body.',
  })
  @ApiPrivate('user')
  @ApiMongoIdParam('id', 'Request ObjectId')
  @ApiResponse({ status: 200, description: 'Request deleted (empty body)' })
  @ApiErrors(
    [400, 'Invalid ObjectId'],
    [401, 'Missing/invalid token, role not allowed, or the request does not belong to the user'],
    [404, 'Request not found'],
  )
  @Delete(':id')
  @Roles(Role.User)
  @UseGuards(AuthGuard, RolesGuard)
  remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.reqProductService.remove(id, user);
  }
}
