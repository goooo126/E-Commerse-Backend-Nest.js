import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/** Raw result returned by Cloudinary's upload API (main fields). */
export class CloudinaryUploadResponseDto {
  @ApiProperty({ example: '3f5a0c7e8b1d4e2a9c6b7d8e9f0a1b2c' })
  asset_id!: string;

  @ApiProperty({ example: 'sample_abc123', description: 'Use it to delete/transform the image later' })
  public_id!: string;

  @ApiProperty({ example: 1762160000 })
  version!: number;

  @ApiProperty({ example: 'v1762160000' })
  version_id!: string;

  @ApiProperty({ example: 'a1b2c3d4e5f6a7b8c9d0' })
  signature!: string;

  @ApiProperty({ example: 800 })
  width!: number;

  @ApiProperty({ example: 600 })
  height!: number;

  @ApiProperty({ example: 'jpg' })
  format!: string;

  @ApiProperty({ example: 'image' })
  resource_type!: string;

  @ApiProperty({ example: '2026-11-03T10:15:30Z' })
  created_at!: string;

  @ApiProperty({ example: [], type: [String] })
  tags!: string[];

  @ApiProperty({ example: 45210, description: 'File size in bytes' })
  bytes!: number;

  @ApiProperty({ example: 'upload' })
  type!: string;

  @ApiProperty({ example: 'http://res.cloudinary.com/demo/image/upload/v1762160000/sample_abc123.jpg' })
  url!: string;

  @ApiProperty({ example: 'https://res.cloudinary.com/demo/image/upload/v1762160000/sample_abc123.jpg', description: 'HTTPS URL to store in the database' })
  secure_url!: string;

  @ApiPropertyOptional({ example: 'sample_abc123.jpg' })
  original_filename?: string;
}
