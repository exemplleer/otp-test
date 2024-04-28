import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { SendOtpDto } from './dto/send-otp.dto';
import { CheckOtpDto } from './dto/check-otp.dto';
import { PrismaService } from 'nestjs-prisma';
import { RandomService } from 'src/random/random.service';
import { UserService } from 'src/user/user.service';
import { IUserEntity } from 'src/user/user.interface';

@Injectable()
export class OtpService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly randomService: RandomService,
    private readonly userService: UserService,
  ) {}

  async sendOtpCode(sendOtpDto: SendOtpDto) {
    const { phone } = sendOtpDto;
    const user = await this.userService.findOrCreateByPhone(phone, sendOtpDto);
    const otp = await this.createUserOtpCode(user);
    console.log(otp);
    return { message: 'OTP code has been successfully sent' };
  }

  async checkOtpCode(checkOtpDto: CheckOtpDto) {
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
    return { message: 'tokens' };
  }

  private async createUserOtpCode(user: IUserEntity) {
    const expiresAt = new Date(Date.now() + 1000 * 60 * 2); // 2 minutes
    const code = await this.randomService.generateOtpCode();
    // const otp = await this.prisma.otp.findUnique({
    //   where: { userId: user.id },
    // });
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
