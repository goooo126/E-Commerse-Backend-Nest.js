import { Module } from '@nestjs/common';
import { UploadImagesService } from './upload-images.service';
import { UploadImagesController } from './upload-images.controller';
import { CloudinaryProvider } from './cloudinary.provider';

@Module({
  controllers: [UploadImagesController],
  providers: [UploadImagesService,CloudinaryProvider],
  exports: [UploadImagesService,CloudinaryProvider],
})
export class UploadImagesModule {}
