import { Body, Controller, Post } from '@nestjs/common';
import { OtpService } from './otp.service';
import { SendOtpDto } from './dto/send-otp.dto';
import { CheckOtpDto } from './dto/check-otp.dto';

@Controller('/otp')
export class OtpController {
  constructor(private readonly otpService: OtpService) {}

  @Post('/send')
  sendOtpCode(@Body() sendOtpDto: SendOtpDto) {
    return this.otpService.sendOtpCode(sendOtpDto);
  }

  @Post('/check')
  checkOtpCode(@Body() checkOtpDto: CheckOtpDto) {
    return this.otpService.checkOtpCode(checkOtpDto);
  }
}
