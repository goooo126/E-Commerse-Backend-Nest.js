import { ApiHideProperty, ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BaseDocumentDto } from 'src/common/swagger/swagger.helpers';

/**
 * A user document as returned by the API.
 * `password` and `__v` are always removed/excluded by the services.
 */
export class UserResponseDto extends BaseDocumentDto {
  @ApiProperty({ example: 'Ahmed Ali', description: 'Full name' })
  name!: string;

  @ApiProperty({ example: 'ahmed.ali@example.com', description: 'Unique email address' })
  email!: string;

  @ApiProperty({ enum: ['user', 'admin'], example: 'user', description: 'User role' })
  role!: string;

  @ApiPropertyOptional({ example: 'https://example.com/avatars/ahmed.png', description: 'Avatar URL' })
  avatar?: string;

  @ApiPropertyOptional({ example: 25, description: 'Age in years' })
  age?: number;

  @ApiPropertyOptional({ example: '+201012345678', description: 'Phone number (Egyptian format)' })
  phoneNumber?: string;

  @ApiPropertyOptional({ example: '12 Tahrir St, Cairo', description: 'Postal address' })
  address?: string;

  @ApiPropertyOptional({
    example: true,
    description: 'Whether the account is active. Soft-deleted accounts (DELETE /user/profile) have `false`. Set to `true` on sign-up.',
  })
  active?: boolean;

  @ApiPropertyOptional({ enum: ['male', 'female'], example: 'male', description: 'Gender' })
  gender?: string;

  @ApiPropertyOptional({
    example: '108234567890123456789',
    description: 'Google account id. Only present for accounts created through Google sign-in.',
  })
  googleId?: string;

  @ApiProperty({
    example: false,
    description: 'Whether the email was verified (true for accounts created via Google). Defaults to false.',
  })
  emailVerified!: boolean;

  // Internal password-reset fields: returned by some endpoints but not meant for clients
  @ApiHideProperty()
  verificationCode?: string;

  @ApiHideProperty()
  verificationCodeExpired?: Date;
}

/** Subset of the user returned by POST /user (admin create) */
export class CreatedUserResponseDto {
  @ApiProperty({ example: 'Ahmed Ali' })
  name!: string;

  @ApiProperty({ example: 'ahmed.ali@example.com' })
  email!: string;

  @ApiProperty({ enum: ['user', 'admin'], example: 'user', description: 'Defaults to `user` when not sent' })
  role!: string;
}
