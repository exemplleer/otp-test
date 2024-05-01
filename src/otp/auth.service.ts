import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
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

  private async generateAccessToken(payload: any) {
    const secret = 'abc123';
    const expiresIn = 60 * 15;
    return await this.jwtService.signAsync(payload, { secret, expiresIn });
  }

  private async generateRefreshToken(payload: any) {
    const secret = 'zxy987';
    const expiresIn = 60 * 60 * 24 * 7;
    return await this.jwtService.signAsync(payload, { secret, expiresIn });
  }
}
