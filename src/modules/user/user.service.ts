import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { RegisterDto } from '../auth/dto/register.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string) {
    return {
      data: await this.prisma.user.findUnique({
        where: { email },
      }),
    };
  }

  async findById(id: string) {
    return {
      data: await this.prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          email: true,
          name: true,
        },
      }),
    };
  }

  async getAllUser() {
    const users = await this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        updatedAt: true,
      },
    });

    return {
      data: users,
    };
  }

  async createUser({ email, password, name }: RegisterDto) {
    return await this.prisma.user.create({
      data: {
        email,
        password,
        name,
      },
    });
  }

  async deleteById(id: string) {
    return {
      data: await this.prisma.user.delete({
        where: { id },
        select: {
          id: true,
          email: true,
          name: true,
        },
      }),
    };
  }
}
