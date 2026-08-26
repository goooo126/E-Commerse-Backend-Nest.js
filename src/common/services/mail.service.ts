import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor() {}

  async sendOtp(email: string, otp: string) {
    
  }
}
