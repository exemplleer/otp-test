import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { SendOtpDto } from './dto/send-otp.dto';
import { CheckOtpDto } from './dto/check-otp.dto';
import { PrismaService } from 'nestjs-prisma';
import { RandomService } from 'src/shared/random/random.service';
import { UserService } from 'src/modules/user/user.service';
import { IUserEntity } from 'src/modules/user/user.interface';
import { SessionService } from './session.service';
import { Response } from 'express';
import { TokenService } from './token.service';
import { AuthService } from './auth.service';
import { CookieService } from './cookie.service';

@Injectable()
export class OtpService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly sessionService: SessionService,
    private readonly cookieService: CookieService,
    private readonly randomService: RandomService,
    private readonly tokenService: TokenService,
  ) {}

  async sendOtpCode(sendOtpDto: SendOtpDto) {
    const { phone } = sendOtpDto;
    const user = await this.userService.findOrCreateByPhone(phone, sendOtpDto);
    const otp = await this.createUserOtpCode(user);
    console.log(otp); // TODO : use SMS service here
    return { message: 'OTP code has been successfully sent' };
  }

  async checkOtpCode(checkOtpDto: CheckOtpDto, res: Response) {
    const { phone, code } = checkOtpDto;
    const now = new Date();
    const user = await this.userService.findOneByPhone(phone);
    const otp = user?.otp;

    if (!user || !otp) {
      throw new NotFoundException('User not found');
    }
    if (otp.code !== code) {
      throw new UnauthorizedException('OTP code is wrong');
    }
    if (otp.expiresAt < now) {
      throw new UnauthorizedException('OTP code is expired');
    }

    const payload = this.authService.generateUserPayload(user);
    const tokenData = await this.tokenService.generateTokenData(payload);
    const { accessToken, refreshToken } = tokenData;
    await this.sessionService.createRefreshSession(user.id, refreshToken);
    this.cookieService.setCookieRefreshToken(res, refreshToken);
    return { accessToken };
  }

  private async createUserOtpCode(user: IUserEntity) {
    const expiresAt = new Date(Date.now() + 1000 * 60 * 2); // 2 minutes
    const code = await this.randomService.generateSixDigitCode();
    const otp = user?.otp;
    if (!otp) {
      return await this.prisma.otp.create({
        data: { userId: user.id, code, expiresAt },
      });
    } else {
      if (otp.expiresAt > new Date()) {
        throw new BadRequestException('OTP code is not expired');
      }
      return await this.prisma.otp.update({
        where: { userId: user.id },
        data: { code, expiresAt },
      });
    }
  }
}
