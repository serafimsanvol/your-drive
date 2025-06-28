import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class AppService {
  constructor(
    private readonly prismaService: PrismaService, // Assuming PrismaService is imported correctly
  ) {}

  async getHello(): Promise<string> {
    const user = await this.prismaService.user.createMany({
      data: [
        {
          email: `test${Math.random()}@gmail.com`,
          password: 'password123',
        },
      ],
    });
    console.log('User created:', user);
    const users = await this.prismaService.user.findMany(); // Example usage of PrismaService
    return `Hello World! ${JSON.stringify(users)}`;
  }
}
