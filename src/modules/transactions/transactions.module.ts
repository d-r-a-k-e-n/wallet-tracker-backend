import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { PrismaService } from '../../prisma.service';
import { TransactionsController } from './transactions.controller';

@Module({
  controllers: [TransactionsController],
  providers: [TransactionsService, PrismaService],
  exports: [TransactionsService],
})
export class TransactionsModule {}
