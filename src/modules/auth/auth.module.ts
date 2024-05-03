import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { RandomModule } from 'src/shared/random/random.module';
import { HashModule } from 'src/shared/hash/hash.module';
import { UserModule } from 'src/modules/user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { OtpService } from './otp.service';
import { TokenService } from './token.service';
import { CookieService } from './cookie.service';
import { AccessStrategy } from './strategies/access.strategy';
import { RefreshStrategy } from './strategies/refresh.strategy';

@Module({
  imports: [RandomModule, UserModule, HashModule, JwtModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    OtpService,
    TokenService,
    CookieService,
    AccessStrategy,
    RefreshStrategy,
  ],
})
export class AuthModule {}
