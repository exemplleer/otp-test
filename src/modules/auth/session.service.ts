import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class SessionService {
  constructor(private readonly prisma: PrismaService) {}

  async createRefreshSession(userId: number, refreshToken: string) {
    return await this.prisma.refreshSession.create({
      data: { userId, refreshToken },
    });
  }

  async findRefreshSession(refreshToken: string) {
    return await this.prisma.refreshSession.findFirst({
      where: { refreshToken },
    });
  }

  async removeRefreshSession(refreshToken: string) {
    return await this.prisma.refreshSession.deleteMany({
      where: { refreshToken },
    });
  }
}
