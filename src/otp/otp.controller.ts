import { Body, Controller, Post } from '@nestjs/common';
import { OtpService } from './otp.service';
import { SendOtpDto } from './dto/send-otp.dto';

@Controller('/otp')
export class OtpController {
  constructor(private readonly otpService: OtpService) {}

  @Post('/send')
  sendOtpCode(@Body() sendOtpDto: SendOtpDto) {
    return this.otpService.sendOtpCode(sendOtpDto);
  }
}
