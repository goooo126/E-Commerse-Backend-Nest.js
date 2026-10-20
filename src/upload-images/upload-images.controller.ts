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
import { UploadImagesService } from 'src/upload-images/upload-images.service';
import { Roles } from 'src/user/decorator/roles.decorator';
import { Role } from 'src/user/enums/roles.enum';
import { AuthGuard } from 'src/user/guard/auth.guard';
import { RolesGuard } from 'src/user/guard/role.guard';

@Controller('image')
export class UploadImagesController {
  constructor(private readonly cloudinaryService: UploadImagesService) {}

  //?=======================================
  //* @Docs   Admin can uplaod an image to cloudinary
  //* @Route  POST /api/v1/image/upload-image
  //* @access Private['admin']
  //?=======================================
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
