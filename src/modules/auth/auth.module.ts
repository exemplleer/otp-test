import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { HttpModule } from '@nestjs/axios';
import { RandomModule } from 'src/shared/services/random/random.module';
import { UserModule } from 'src/modules/user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { OtpService } from './otp.service';
import { SmsService } from './sms.service';
import { TokenService } from './token.service';
import { CookieService } from './cookie.service';
import { AccessStrategy } from './strategies/access.strategy';
import { RefreshStrategy } from './strategies/refresh.strategy';

@Module({
  imports: [RandomModule, UserModule, JwtModule, HttpModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    OtpService,
    SmsService,
    TokenService,
    CookieService,
    AccessStrategy,
    RefreshStrategy,
  ],
})
export class AuthModule {}
