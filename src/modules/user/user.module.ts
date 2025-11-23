import { Module } from '@nestjs/common';
import { UserService } from 'src/modules/user/user.service';
import { PrismaService } from '../../prisma.service';

@Module({
  controllers: [],
  providers: [UserService, PrismaService],
  exports: [UserService],
})
export class UserModule {}
