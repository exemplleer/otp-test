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
    const secret = process.env.ACCESS_TOKEN_SECRET;
    const expiresIn = process.env.ACCESS_TOKEN_EXPIRATION;
    return await this.jwtService.signAsync(payload, { secret, expiresIn });
  }

  async generateRefreshToken(payload: any) {
    const secret = process.env.REFRESH_TOKEN_SECRET;
    const expiresIn = process.env.REFRESH_TOKEN_EXPIRATION;
    return await this.jwtService.signAsync(payload, { secret, expiresIn });
  }

  async verifyAccessToken(accessToken: string) {
    const secret = process.env.ACCESS_TOKEN_SECRET;
    return await this.jwtService.verifyAsync(accessToken, { secret });
  }

  async verifyRefreshToken(refreshToken: string) {
    const secret = process.env.REFRESH_TOKEN_SECRET;
    return await this.jwtService.verifyAsync(refreshToken, { secret });
  }
}
