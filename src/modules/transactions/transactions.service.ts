import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class TransactionsService {
  constructor(private readonly prisma: PrismaService) {}

  async getMyTransactions(userId: string) {
    try {
      const transactions = await this.prisma.transaction.findMany({
        where: {
          bill: {
            userId,
          },
        },
      });
      return {
        data: transactions,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
