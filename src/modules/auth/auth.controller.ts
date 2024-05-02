import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { Cookies } from 'src/shared/decorators/cookie.decorator';
import { OtpService } from './otp.service';
import { SendOtpDto } from './dto/send-otp.dto';
import { CheckOtpDto } from './dto/check-otp.dto';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { AccessGuard } from './guard/access.guard';
import { RefreshGuard } from './guard/refresh.guard';

@Controller('/auth')
export class AuthController {
  constructor(
    private readonly otpService: OtpService,
    private readonly authService: AuthService,
  ) {}

  @Post('/otp/send')
  sendOtpCode(@Body() sendOtpDto: SendOtpDto) {
    return this.otpService.sendOtpCode(sendOtpDto);
  }

  @Post('/otp/check')
  checkOtpCode(
    @Body() checkOtpDto: CheckOtpDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.otpService.checkOtpCode(checkOtpDto, res);
  }

  @UseGuards(RefreshGuard)
  @Get('/refresh')
  refresh(
    @Cookies('refreshToken') refreshToken: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.updateRefreshSession(refreshToken, res);
  }

  @UseGuards(AccessGuard)
  @Get('/logout')
  logout(
    @Cookies('refreshToken') refreshToken: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.logout(refreshToken, res);
  }
}
