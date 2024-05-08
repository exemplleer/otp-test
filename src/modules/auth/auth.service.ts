import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { IRefreshSession, ITokenData, IUserPayload } from './auth.interface';
import { UserService } from 'src/modules/user/user.service';
import { IUserEntity } from 'src/modules/user/user.interface';
import { PrismaService } from 'nestjs-prisma';
import { TokenService } from './token.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
  ) {}

  async updateSession(
    refreshToken: string,
    fingerprint: string,
  ): Promise<ITokenData> {
    if (!refreshToken) {
      throw new UnauthorizedException('Not authorized. Please, login');
    }

    const sessions = await this.findSession(refreshToken, fingerprint);
    if (sessions.length === 0) {
      throw new UnauthorizedException('Not authorized. Please, login');
    }
    const isFingerprintExists = sessions.some(
      (session) => session.fingerprint === fingerprint,
    );
    if (!isFingerprintExists) {
      throw new ForbiddenException('Access denied');
    }

    await this.clearSession(refreshToken, fingerprint);

    const oldPayload = await this.tokenService
      .verifyRefreshToken(refreshToken)
      .catch(() => {
        throw new ForbiddenException('Access denied');
      });

    const user = await this.userService.findOneByPhone(oldPayload.phone);
    const tokenData = await this.createSession(user, fingerprint);
    return tokenData;
  }

  async clearSession(refreshToken: string, fingerprint: string): Promise<void> {
    if (!refreshToken) {
      throw new UnauthorizedException('Not authorized. Please, login');
    }
    await this.prisma.refreshSession.deleteMany({
      where: { AND: { refreshToken, fingerprint } },
    });
  }

  async createSession(
    user: IUserEntity,
    fingerprint: string,
  ): Promise<ITokenData> {
    const payload = this.generateUserPayload(user);
    const tokenData = await this.tokenService.generateTokenData(payload);
    const refreshToken = tokenData.refreshToken;
    await this.prisma.refreshSession.create({
      data: { userId: user.id, refreshToken, fingerprint },
    });
    return tokenData;
  }

  private async findSession(
    refreshToken: string,
    fingerprint: string,
  ): Promise<IRefreshSession[]> {
    return await this.prisma.refreshSession.findMany({
      where: { AND: { refreshToken, fingerprint } },
    });
  }

  private generateUserPayload(user: IUserEntity): Readonly<IUserPayload> {
    return Object.freeze({
      uuid: user.uuid,
      phone: user.phone,
    });
  }
}
