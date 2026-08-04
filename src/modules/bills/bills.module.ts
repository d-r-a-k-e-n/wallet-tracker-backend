import { Module } from '@nestjs/common';
import { BillsService } from './bills.service';
import { PrismaService } from '../../prisma.service';
import { BillsController } from './bills.controller';

@Module({
  controllers: [BillsController],
  providers: [BillsService, PrismaService],
  exports: [BillsService],
})
export class BillsModule {}
