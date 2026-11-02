import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { OAuth2Client } from 'google-auth-library';
import { Model } from 'mongoose';
import { User } from 'src/user/user.schema';

@Injectable()
export class GoogleAuthService {
  private readonly googleClient: OAuth2Client;

  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {
    this.googleClient = new OAuth2Client(
      this.configService.getOrThrow<string>('GOOGLE_CLIENT_ID'),
    );
  }

  async googleLogin(idToken: string) {
    if (typeof idToken !== 'string' || !idToken) {
      throw new UnauthorizedException('Invalid Google ID Token');
    }
    // 1. Verify the Google ID token
    const ticket = await this.googleClient.verifyIdToken({
      idToken,
      audience: this.configService.getOrThrow<string>('GOOGLE_CLIENT_ID'),
    });

    const payload = ticket.getPayload();

    if (
      !payload ||
      !payload.sub ||
      !payload.email ||
      payload.email_verified !== true
    ) {
      throw new UnauthorizedException(
        'Invalid Google account or unverified email',
      );
    }

    const googleId = payload.sub;
    const email = payload.email.toLowerCase();

    // 2. Find an account already linked to this Google ID
    let user = await this.userModel.findOne({ googleId });

    if (!user) {
      // 3. Check whether this email already belongs
      // to a local account
      const existingUser = await this.userModel.findOne({
        email,
      });

      if (existingUser) {
        // Never link an existing account automatically
        // unless your account-linking policy verifies
        // ownership of BOTH accounts.
        throw new ConflictException(
          'An account already exists with this email. ' +
            'Sign in using your existing method, then ' +
            'link Google through a verified account-linking flow.',
        );
      }

      // 4. Create a Google-only account
      user = await this.userModel.create({
        name: payload.name || email.split('@')[0],
        email,
        googleId,
        emailVerified: true,
        role:'user'
        // Add any required fields from your own schema.
      });
    }

    // 5. Issue your application's JWT
    //* create access token:
    const payloadJWT = {
      name: user.name,
      email: user.email,
      id: user._id,
      role: 'user',
    };

    const token = await this.jwtService.signAsync(payloadJWT);

    return {
      message: 'Google authentication successful',
      token,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
      },
    };
  }
}
