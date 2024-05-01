import { Module } from '@nestjs/common';
import { OtpService } from './otp.service';
import { OtpController } from './otp.controller';
import { RandomModule } from 'src/random/random.module';
import { UserModule } from 'src/user/user.module';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { AccessStrategy } from './strategy/access.strategy';
import { RefreshStrategy } from './strategy/refresh.strategy';

@Module({
  imports: [RandomModule, UserModule, JwtModule],
  controllers: [OtpController],
  providers: [OtpService, AuthService, AccessStrategy, RefreshStrategy],
})
export class OtpModule {}
