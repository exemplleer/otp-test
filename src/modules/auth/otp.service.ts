import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { UserService } from 'src/modules/user/user.service';
import { IUserEntity, IOtpEntity } from 'src/modules/user/user.interface';
import { RandomService } from 'src/shared/services/random/random.service';
import { SmsService } from './sms.service';
import { AuthService } from './auth.service';
import { ITokenData } from './auth.interface';
import { SendOtpDto } from './dto/send-otp.dto';
import { CheckOtpDto } from './dto/check-otp.dto';

@Injectable()
export class OtpService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly smsService: SmsService,
    private readonly randomService: RandomService,
  ) {}

  async sendOtpCode(sendOtpDto: SendOtpDto): Promise<void> {
    const { phone } = sendOtpDto;
    const user = await this.userService.findOrCreateByPhone(phone, sendOtpDto);
    const otp = await this.createOrUpdateUserOtpCode(user);
    await this.smsService.sendSmsWithCodeViaExolve(phone, otp.code);
    console.log(otp);
  }

  async checkOtpCode(
    checkOtpDto: CheckOtpDto,
    fingerprint: string,
  ): Promise<ITokenData> {
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

    const tokenData = await this.authService.createSession(user, fingerprint);
    return tokenData;
  }

  private async createOrUpdateUserOtpCode(
    user: IUserEntity,
  ): Promise<IOtpEntity> {
    const expiresAt = new Date(Date.now() + 1000 * 60 * 2); // 2 minutes
    const code = await this.generateOtpCode();
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

  private async generateOtpCode(): Promise<string> {
    const length = 6;
    return await this.randomService.generateDigitString(length);
  }
}
