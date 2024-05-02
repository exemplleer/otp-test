import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TokenService {
  constructor(private readonly jwtService: JwtService) {}

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

  async generateAccessToken(payload: any) {
    const secret = 'abc123';
    const expiresIn = 60 * 15; // 15 minutes
    return await this.jwtService.signAsync(payload, { secret, expiresIn });
  }

  async generateRefreshToken(payload: any) {
    const secret = 'zxy987';
    const expiresIn = 60 * 60 * 24 * 7; // 7 days
    return await this.jwtService.signAsync(payload, { secret, expiresIn });
  }

  async verifyAccessToken(accessToken: string) {
    const secret = 'abc123';
    return await this.jwtService.verifyAsync(accessToken, { secret });
  }

  async verifyRefreshToken(refreshToken: string) {
    const secret = 'zxy987';
    return await this.jwtService.verifyAsync(refreshToken, { secret });
  }
}
