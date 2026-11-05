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
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Role } from 'src/user/enums/roles.enum';
import { Roles } from 'src/user/decorator/roles.decorator';
import { AuthGuard } from 'src/user/guard/auth.guard';
import { RolesGuard } from 'src/user/guard/role.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { GetReviewDto } from './dto/get-review.dto';
import { ApiExtraModels, ApiOperation, ApiResponse, ApiTags, getSchemaPath } from '@nestjs/swagger';
import {
  ApiEnvelopeResponse,
  ApiErrors,
  ApiMongoIdParam,
  ApiPrivate,
  PaginationDto,
} from 'src/common/swagger/swagger.helpers';
import { ReviewResponseDto } from './dto/review-response.dto';

@ApiTags('Review')
@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  //?=======================================
  //* @Docs   User can add new Review
  //* @Route  POST /api/v1/review
  //* @access Private['user']
  //?=======================================
  @ApiOperation({
    summary: 'Create a review',
    description:
      'Adds a review for a product on behalf of the authenticated user. **Access:** User. A user can review a given product only once (400 otherwise); the product must exist (404).',
  })
  @ApiPrivate('user')
  @ApiEnvelopeResponse({
    status: 201,
    bodyStatus: 201,
    description: 'Review created',
    message: 'The review is created successfuly',
    model: ReviewResponseDto,
  })
  @ApiErrors(
    [400, 'Validation failed, or the user already reviewed this product'],
    [404, 'Product not found'],
  )
  @Post()
  @Roles(Role.User)
  @UseGuards(AuthGuard, RolesGuard)
  create(
    @CurrentUser() user: any,
    @Body(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    )
    createReviewDto: CreateReviewDto,
  ) {
    return this.reviewService.create(createReviewDto, user);
  }

  //?=======================================
  //* @Docs   Admin can get all reviews and user can get all own reviews
  //* @Route  GET /api/v1/review
  //* @access Private['admin','user']
  //?=======================================
  @ApiOperation({
    summary: 'List reviews',
    description:
      'Returns reviews with the reviewer populated (name only). **Access:** User & Admin. Admins see all reviews; users see only their own. Defaults: limit 10, skip 0. Unlike most list endpoints, `data` is the array of reviews and `pagination` sits next to it at the top level; for users `pagination.total` counts all reviews in the system, not only their own.',
  })
  @ApiPrivate('admin', 'user')
  @ApiEnvelopeResponse({
    description: 'Reviews fetched (admin: "get all reviews", user: "get all reviews owned by the user")',
    message: 'get all reviews',
    bodyStatus: 200,
    data: { type: 'array', items: { $ref: getSchemaPath(ReviewResponseDto) } },
    extra: { pagination: { $ref: getSchemaPath(PaginationDto) } },
  })
  @ApiExtraModels(ReviewResponseDto, PaginationDto)
  @Get()
  @Roles(Role.User, Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  findAll(@Query() query: GetReviewDto, @CurrentUser() user: any) {
    return this.reviewService.findAll(query,user);
  }

  //?=======================================
  //* @Docs   Admin can get single review and user can get single own review
  //* @Route  GET /api/v1/review/:Id
  //* @access Private['admin','user']
  //?=======================================
  @ApiOperation({
    summary: 'Get a review by id',
    description:
      'Returns a single review (the reviewer is not populated). **Access:** User & Admin. Admins can read any review; a user can read only their own (401 otherwise).',
  })
  @ApiPrivate('admin', 'user')
  @ApiMongoIdParam('id', 'Review ObjectId')
  @ApiEnvelopeResponse({
    description: 'Review found',
    message: 'The review founded',
    model: ReviewResponseDto,
  })
  @ApiErrors(
    [400, 'Invalid ObjectId'],
    [401, 'Missing/invalid token, or the review does not belong to the user'],
    [404, 'Review not found'],
  )
  @Get(':id')
  @Roles(Role.User, Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.reviewService.findOne(id, user);
  }

  //?=======================================
  //* @Docs   User can update own review
  //* @Route  PATCH /api/v1/review/:Id
  //* @access Private['user']
  //?=======================================
  @ApiOperation({
    summary: 'Update own review',
    description:
      'Partially updates a review (all body fields optional). **Access:** User (owner only). Updating the rating also recalculates the product rating.',
  })
  @ApiPrivate('user')
  @ApiMongoIdParam('id', 'Review ObjectId')
  @ApiEnvelopeResponse({
    description: 'Review updated',
    message: 'The review updated successfully',
    model: ReviewResponseDto,
  })
  @ApiErrors(
    [400, 'Validation failed or invalid ObjectId'],
    [401, 'Missing/invalid token, role not allowed, or the user does not own the review'],
    [404, 'Review or its product not found'],
  )
  @Patch(':id')
  @Roles(Role.User)
  @UseGuards(AuthGuard, RolesGuard)
  update(
    @Param('id') id: string,
    @Body(new ValidationPipe({
      whitelist: true,
      transform: true,
    }),) updateReviewDto: UpdateReviewDto,
    @CurrentUser() user: any,
  ) {
    return this.reviewService.update(id, updateReviewDto, user);
  }

  //?=======================================
  //* @Docs   User can Delete own review or Admin can delete any review
  //* @Route  DELETE /api/v1/review/:Id
  //* @access Private['user','admin']
  //?=======================================
  @ApiOperation({
    summary: 'Delete a review',
    description:
      'Deletes a review and recalculates the product rating. **Access:** User & Admin. The route allows both roles, but the service only lets the review owner delete it (403 for anyone else, including admins). Returns HTTP 200 with an empty body.',
  })
  @ApiPrivate('admin', 'user')
  @ApiMongoIdParam('id', 'Review ObjectId')
  @ApiResponse({ status: 200, description: 'Review deleted (empty body)' })
  @ApiErrors(
    [400, 'Invalid ObjectId'],
    [403, 'The authenticated user is not the owner of the review'],
    [404, 'Review not found'],
  )
  @Delete(':id')
  @Roles(Role.Admin, Role.User)
  @UseGuards(AuthGuard, RolesGuard)
  remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.reviewService.remove(id, user);
  }
}
