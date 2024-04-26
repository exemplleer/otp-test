import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SendOtpDto } from './dto/send-otp.dto';
import { PrismaService } from 'nestjs-prisma';
import { RandomService } from 'src/random/random.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly randomService: RandomService,
  ) {}

  async sendOtpCode(sendOtpDto: SendOtpDto) {
    const { phone } = sendOtpDto;
    let user = await this.prisma.user.findUnique({ where: { phone } });
    if (!user) user = await this.prisma.user.create({ data: { phone } });
    const otp = await this.createUserOtpCode(user.id);
    console.log(otp);
    return { message: 'OTP code has been successfully sent' };
  }

  private async createUserOtpCode(userId: number) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');
    const expiresAt = new Date(Date.now() + 1000 * 60 * 2); // 2 minutes
    const code = await this.randomService.generateOtpCode();
    const otp = await this.prisma.otp.findUnique({
      where: { userId: user.id },
    });
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
