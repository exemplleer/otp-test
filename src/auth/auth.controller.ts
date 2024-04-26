import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SendOtpDto } from './dto/send-otp.dto';

@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/otp/send')
  sendOtpCode(@Body() sendOtpDto: SendOtpDto) {
    return this.authService.sendOtpCode(sendOtpDto);
  }
}
