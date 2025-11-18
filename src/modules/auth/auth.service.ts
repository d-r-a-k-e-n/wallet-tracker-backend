import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class AuthServise {
  constructor(private prisma: PrismaService) {}

  register(): any {
    return this.prisma.user.findMany();
  }
}
