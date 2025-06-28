import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async findUser(where: Prisma.UserWhereUniqueInput) {
    const users = await this.prismaService.user.findFirst({
      where,
    });
    return users;
  }

  async createUser(
    data: Omit<Prisma.UserCreateInput, 'id' | 'createdAt' | 'updatedAt'>,
  ) {
    const user = await this.prismaService.user.create({
      data,
    });
    return user;
  }

  async updateUser({
    data,
    where,
  }: {
    where: Prisma.UserWhereUniqueInput;
    data: Omit<Prisma.UserUpdateInput, 'id' | 'createdAt' | 'updatedAt'>;
  }) {
    const updatedUser = await this.prismaService.user.update({
      data,
      where,
    });

    return updatedUser;
  }
}
