import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ITokenData, IUserPayload } from './auth.interface';
import { UserService } from 'src/modules/user/user.service';
import { IUserEntity } from 'src/modules/user/user.interface';
import { SessionService } from './session.service';
import { TokenService } from './token.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly sessionService: SessionService,
    private readonly tokenService: TokenService,
  ) {}

  async refresh(
    currentRefreshToken: string,
    fingerprint: string,
  ): Promise<ITokenData> {
    if (!currentRefreshToken) {
      throw new UnauthorizedException('Not authorized. Please, login');
    }

    const session = await this.sessionService.findRefreshSession(
      currentRefreshToken,
      fingerprint,
    );

    if (!session) {
      throw new UnauthorizedException('Not authorized. Please, login');
    }

    if (session.fingerprint !== fingerprint) {
      throw new ForbiddenException('Access denied');
    }

    await this.sessionService.removeRefreshSession(
      currentRefreshToken,
      fingerprint,
    );
    const oldPayload = await this.tokenService
      .verifyRefreshToken(currentRefreshToken)
      .catch(() => {
        throw new ForbiddenException('Access denied');
      });
    const user = await this.userService.findOneByPhone(oldPayload.phone);
    const newPayload = this.generateUserPayload(user);
    const tokenData = await this.tokenService.generateTokenData(newPayload);
    const { refreshToken } = tokenData;
    await this.sessionService.createRefreshSession(
      user.id,
      refreshToken,
      fingerprint,
    );
    return tokenData;
  }

  async logout(refreshToken: string, fingerprint: string): Promise<void> {
    if (!refreshToken) {
      throw new UnauthorizedException('Not authorized. Please, login');
    }
    await this.sessionService.removeRefreshSession(refreshToken, fingerprint);
  }

  generateUserPayload(user: IUserEntity): Readonly<IUserPayload> {
    return Object.freeze({
      uuid: user.uuid,
      phone: user.phone,
    });
  }
}
