import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { Cookie } from 'src/shared/decorators/cookie.decorator';
import { Fingerprint } from 'src/shared/decorators/fingerprint.decorator';
import { AccessGuard } from 'src/shared/guards/access.guard';
import { RefreshGuard } from 'src/shared/guards/refresh.guard';
import { AuthService } from './auth.service';
import { OtpService } from './otp.service';
import { SendOtpDto } from './dto/send-otp.dto';
import { CheckOtpDto } from './dto/check-otp.dto';
import { CookieService } from './cookie.service';
import { Response } from 'express';

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
    const td = await this.otpService.checkOtpCode(checkOtpDto, fingerprint);
    const { accessToken, refreshToken } = td;
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
    const td = await this.authService.updateSession(refreshToken, fingerprint);
    const { accessToken, refreshToken: newRefreshToken } = td;
    this.cookieService.setRefreshToken(res, newRefreshToken);
    return { accessToken };
  }

  @UseGuards(AccessGuard, RefreshGuard)
  @Get('/logout')
  async logout(
    @Cookie('refreshToken') refreshToken: string,
    @Fingerprint() fingerprint: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.authService.clearSession(refreshToken, fingerprint);
    this.cookieService.clearRefreshToken(res);
    return { message: 'User has successfully logged out' };
  }
}
