import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { IUserEntity } from './user.interface';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    return await this.prisma.user.create({ data: createUserDto });
  }

  async findAll() {
    return await this.prisma.user.findMany();
  }

  async findOneById(id: number) {
    return await this.prisma.user.findUnique({
      where: { id },
      include: { otp: true },
    });
  }

  async findOneByPhone(phone: string) {
    return await this.prisma.user.findUnique({
      where: { phone },
      include: { otp: true },
    });
  }

  async findOrCreateByPhone(phone: string, data: CreateUserDto) {
    let user: IUserEntity = await this.findOneByPhone(phone);
    if (!user) user = await this.create(data);
    return user;
  }

  async updateById(id: number, updateUserDto: UpdateUserDto) {
    return await this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  async removeById(id: number) {
    return await this.prisma.user.delete({ where: { id } });
  }
}
