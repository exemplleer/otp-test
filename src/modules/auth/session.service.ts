import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class SessionService {
  constructor(private readonly prisma: PrismaService) {}

  async createRefreshSession(
    userId: number,
    refreshToken: string,
    fingerprint: string,
  ) {
    return await this.prisma.refreshSession.create({
      data: { userId, refreshToken, fingerprint },
    });
  }

  async findRefreshSession(refreshToken: string, fingerprint: string) {
    return await this.prisma.refreshSession.findUnique({
      where: { fingerprint_refreshToken: { fingerprint, refreshToken } },
    });
  }

  async removeRefreshSession(refreshToken: string, fingerprint: string) {
    return await this.prisma.refreshSession.delete({
      where: { fingerprint_refreshToken: { fingerprint, refreshToken } },
    });
  }
}
