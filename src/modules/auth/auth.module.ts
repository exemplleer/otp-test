import { Module } from '@nestjs/common';
import { OtpService } from './otp.service';
import { AuthController } from './auth.controller';
import { RandomModule } from 'src/shared/random/random.module';
import { UserModule } from 'src/modules/user/user.module';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { AccessStrategy } from './strategy/access.strategy';
import { RefreshStrategy } from './strategy/refresh.strategy';
import { SessionService } from './session.service';
import { HashModule } from 'src/shared/hash/hash.module';
import { TokenService } from './token.service';
import { CookieService } from './cookie.service';

@Module({
  imports: [RandomModule, UserModule, HashModule, JwtModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    OtpService,
    SessionService,
    TokenService,
    CookieService,
    AccessStrategy,
    RefreshStrategy,
  ],
})
export class AuthModule {}
