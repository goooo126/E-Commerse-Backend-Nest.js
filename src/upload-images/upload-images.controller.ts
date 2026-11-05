// app.controller.ts
import {
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { Max } from 'class-validator';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ApiErrors, ApiPrivate } from 'src/common/swagger/swagger.helpers';
import { CloudinaryUploadResponseDto } from './dto/cloudinary-upload-response.dto';
import { UploadImagesService } from 'src/upload-images/upload-images.service';
import { Roles } from 'src/user/decorator/roles.decorator';
import { Role } from 'src/user/enums/roles.enum';
import { AuthGuard } from 'src/user/guard/auth.guard';
import { RolesGuard } from 'src/user/guard/role.guard';

@ApiTags('Upload')
@Controller('image')
export class UploadImagesController {
  constructor(private readonly cloudinaryService: UploadImagesService) {}

  //?=======================================
  //* @Docs   Admin can uplaod an image to cloudinary
  //* @Route  POST /api/v1/image/upload-image
  //* @access Private['admin']
  //?=======================================
  @ApiOperation({
    summary: 'Upload an image to Cloudinary',
    description:
      'Uploads one image (multipart field `file`) to Cloudinary and returns the raw Cloudinary result. Use `secure_url` as `imageCover`/`images` when creating products, or as `image` for categories/brands. **Access:** Admin. Allowed types: jpeg, jpg, png. Max size: 500,000 bytes (~488 KB).',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['file'],
      properties: {
        file: { type: 'string', format: 'binary', description: 'jpeg/jpg/png image, max 500,000 bytes' },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Image uploaded', type: CloudinaryUploadResponseDto })
  @ApiErrors([400, 'Bad Request – file missing, larger than 500,000 bytes, or not jpeg/jpg/png'])
  @ApiPrivate('admin')
  @Post('upload-image')
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  @UseInterceptors(FileInterceptor('file'))
  uploadImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 500000 }),
          new FileTypeValidator({
            fileType: /^image\/(jpeg|png|jpg)$/,
          }),
        ],
      }),
    )
    file: Parameters<UploadImagesService['uploadFile']>[0],
  ) {
    return this.cloudinaryService.uploadFile(file);
  }
}
