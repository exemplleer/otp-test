import { Module } from '@nestjs/common';
import { OtpService } from './otp.service';
import { OtpController } from './otp.controller';
import { RandomModule } from 'src/random/random.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [RandomModule, UserModule],
  controllers: [OtpController],
  providers: [OtpService],
})
export class OtpModule {}
