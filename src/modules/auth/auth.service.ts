import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SessionService } from './session.service';
import { IUserPayload } from './auth.interface';
import { UserService } from 'src/modules/user/user.service';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly sessionService: SessionService,
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
    const oldPayload = await this.verifyRefreshToken(currentRefreshToken).catch(
      () => {
        throw new ForbiddenException('Access denied');
      },
    );
    const user = await this.userService.findOneByPhone(oldPayload.phone);
    const actualPayload: IUserPayload = { uuid: user.uuid, phone: user.phone };
    const tokenData = await this.generateTokenData(actualPayload);
    const { accessToken, refreshToken } = tokenData;
    await this.sessionService.createRefreshSession(user.id, refreshToken);
    this.setRefreshTokenCookie(res, refreshToken);
    return { accessToken };
  }

  async logout(refreshToken: string, res: Response) {
    if (!refreshToken) {
      throw new UnauthorizedException('Not authorized. Please, login');
    }
    await this.sessionService.removeRefreshSession(refreshToken);
    this.clearRefreshTokenCookie(res);
    return { message: 'User has successfully logged out' };
  }

  setRefreshTokenCookie(res: Response, refreshToken: string) {
    res.cookie('refreshToken', refreshToken);
  }

  clearRefreshTokenCookie(res: Response) {
    res.clearCookie('refreshToken');
  }

  async generateTokenData(payload: any) {
    const [accessToken, refreshToken] = await Promise.all([
      this.generateAccessToken(payload),
      this.generateRefreshToken(payload),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  private async generateAccessToken(payload: any) {
    const secret = 'abc123';
    const expiresIn = 60 * 15; // 15 minutes
    return await this.jwtService.signAsync(payload, { secret, expiresIn });
  }

  private async generateRefreshToken(payload: any) {
    const secret = 'zxy987';
    const expiresIn = 60 * 60 * 24 * 7; // 7 days
    return await this.jwtService.signAsync(payload, { secret, expiresIn });
  }

  private async verifyRefreshToken(refreshToken: string) {
    const secret = 'zxy987';
    return await this.jwtService.verifyAsync(refreshToken, { secret });
  }
}
