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
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Role } from 'src/user/enums/roles.enum';
import { Roles } from 'src/user/decorator/roles.decorator';
import { AuthGuard } from 'src/user/guard/auth.guard';
import { RolesGuard } from 'src/user/guard/role.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';

@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  //?=======================================
  //* @Docs   User can add new Review
  //* @Route  POST /api/v1/review
  //* @access Private['user']
  //?=======================================
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
  @Get()
  @Roles(Role.User, Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  findAll(@CurrentUser() user: any) {
    return this.reviewService.findAll(user);
  }

  //?=======================================
  //* @Docs   Admin can get single review and user can get single own review
  //* @Route  GET /api/v1/review/:Id
  //* @access Private['admin','user']
  //?=======================================
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
  @Patch(':id')
  @Roles(Role.User)
  @UseGuards(AuthGuard, RolesGuard)
  update(
    @Param('id') id: string,
    @Body() updateReviewDto: UpdateReviewDto,
    @CurrentUser() user: any,
  ) {
    return this.reviewService.update(id, updateReviewDto, user);
  }

  //?=======================================
  //* @Docs   User can Delete own review or Admin can delete any review
  //* @Route  DELETE /api/v1/review/:Id
  //* @access Private['user','admin']
  //?=======================================
  @Delete(':id')
  @Roles(Role.Admin,Role.User)
  @UseGuards(AuthGuard,RolesGuard)
  remove(@Param('id') id: string,@CurrentUser() user:any) {
    return this.reviewService.remove(id,user);
  }
}
