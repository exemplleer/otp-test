import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { Cookie } from 'src/shared/decorators/cookie.decorator';
import { AuthService } from './auth.service';
import { OtpService } from './otp.service';
import { SendOtpDto } from './dto/send-otp.dto';
import { CheckOtpDto } from './dto/check-otp.dto';
import { CookieService } from './cookie.service';
import { RefreshGuard } from './guard/refresh.guard';
import { Response } from 'express';
import { Fingerprint } from 'src/shared/decorators/fingerprint.decorator';

@Controller('/auth')
export class AuthController {
  constructor(
    private readonly otpService: OtpService,
    private readonly authService: AuthService,
    private readonly cookieService: CookieService,
  ) {}

  @Post('/otp/send')
  async sendOtpCode(@Body() sendOtpDto: SendOtpDto) {
    await this.otpService.sendOtpCode(sendOtpDto);
    return { message: 'OTP code has been successfully sent' };
  }

  @Post('/otp/check')
  async checkOtpCode(
    @Body() checkOtpDto: CheckOtpDto,
    @Fingerprint() fingerprint: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const tokenData = await this.otpService.checkOtpCode(
      checkOtpDto,
      fingerprint,
    );
    const { accessToken, refreshToken } = tokenData;
    this.cookieService.setRefreshToken(res, refreshToken);
    return { accessToken };
  }

  @UseGuards(RefreshGuard)
  @Get('/refresh')
  async refresh(
    @Cookie('refreshToken') refreshToken: string,
    @Fingerprint() fingerprint: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const tokenData = await this.authService.refresh(refreshToken, fingerprint);
    const { accessToken, refreshToken: newRefreshToken } = tokenData;
    this.cookieService.setRefreshToken(res, newRefreshToken);
    return { accessToken };
  }

  @UseGuards(RefreshGuard)
  @Get('/logout')
  async logout(
    @Cookie('refreshToken') refreshToken: string,
    @Fingerprint() fingerprint: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.authService.logout(refreshToken, fingerprint);
    this.cookieService.clearRefreshToken(res);
    return { message: 'User has successfully logged out' };
  }
}
