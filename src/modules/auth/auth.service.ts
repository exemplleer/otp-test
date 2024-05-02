import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { SessionService } from './session.service';
import { IUserPayload } from './auth.interface';
import { UserService } from 'src/modules/user/user.service';
import { Response } from 'express';
import { TokenService } from './token.service';
import { IUserEntity } from '../user/user.interface';
import { CookieService } from './cookie.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly sessionService: SessionService,
    private readonly tokenService: TokenService,
    private readonly cookieService: CookieService,
  ) {}

  async updateRefreshSession(currentRefreshToken: string, res: Response) {
    if (!currentRefreshToken) {
      throw new UnauthorizedException('Not authorized. Please, login');
    }

    const session =
      await this.sessionService.findRefreshSession(currentRefreshToken);

    if (!session) {
      throw new UnauthorizedException('Not authorized. Please, login');
    }

    // TODO : add fingerprint compare logic here

    await this.sessionService.removeRefreshSession(currentRefreshToken);
    const oldPayload = await this.tokenService
      .verifyRefreshToken(currentRefreshToken)
      .catch(() => {
        throw new ForbiddenException('Access denied');
      });
    const user = await this.userService.findOneByPhone(oldPayload.phone);
    const newPayload = this.generateUserPayload(user);
    const tokenData = await this.tokenService.generateTokenData(newPayload);
    const { accessToken, refreshToken } = tokenData;
    await this.sessionService.createRefreshSession(user.id, refreshToken);
    this.cookieService.setCookieRefreshToken(res, refreshToken);
    return { accessToken };
  }

  async logout(refreshToken: string, res: Response) {
    if (!refreshToken) {
      throw new UnauthorizedException('Not authorized. Please, login');
    }
    await this.sessionService.removeRefreshSession(refreshToken);
    this.cookieService.clearCookieRefreshToken(res);
    return { message: 'User has successfully logged out' };
  }

  generateUserPayload(user: IUserEntity): Readonly<IUserPayload> {
    return Object.freeze({
      uuid: user.uuid,
      phone: user.phone,
    });
  }
}
