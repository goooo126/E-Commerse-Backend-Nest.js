import { ApiProperty } from '@nestjs/swagger';
import { EXAMPLE_OBJECT_ID } from 'src/common/swagger/swagger.helpers';

export class GoogleAuthUserDto {
  @ApiProperty({ example: EXAMPLE_OBJECT_ID, description: 'MongoDB ObjectId of the user' })
  id!: string;

  @ApiProperty({ example: 'Ahmed Ali' })
  name!: string;

  @ApiProperty({ example: 'ahmed.ali@example.com' })
  email!: string;
}

/** POST /auth/google response – NOT wrapped in the usual { status, message, data } envelope */
export class GoogleAuthResponseDto {
  @ApiProperty({ example: 'Google authentication successful' })
  message!: string;

  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhOGIyNDY5In0.signature',
    description: 'Application JWT (send it as `Authorization: Bearer <token>`). The role in the token is always `user`.',
  })
  token!: string;

  @ApiProperty({ type: GoogleAuthUserDto })
  user!: GoogleAuthUserDto;
}
