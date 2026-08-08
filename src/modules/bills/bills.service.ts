import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { CreateBillDto } from './dto/createBill.dto';
import { UpdateBillDto } from './dto/updateBill.dto';
import cc from 'currency-codes';

@Injectable()
export class BillsService {
  constructor(private prisma: PrismaService) {}
  getCurrencyInfo = (currency: string) => {
    const currencyInfo = cc.code(currency.toUpperCase());
    if (!currencyInfo) {
      throw new BadRequestException(`Currency ${currency} is not supported`);
    }
    return currencyInfo;
  };

  async getMyBills(userId: string) {
    try {
      const bills = await this.prisma.bill.findMany({
        where: {
          userId,
        },
      });
      return {
        data: bills,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async deleteBill(id: string) {
    try {
      await this.prisma.bill.deleteMany({
        where: {
          id,
        },
      });
      return {
        message: 'Bill deleted successfully',
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async createBill(
    userId: string,
    { name, currency, balance = 0, color }: CreateBillDto,
  ) {
    try {
      const createdBill = await this.prisma.bill.create({
        data: {
          userId,
          name,
          balance,
          color,
          currency: this.getCurrencyInfo(currency).code,
        },
      });

      return {
        data: createdBill,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async updateBill(id: string, { name, currency }: UpdateBillDto) {
    try {
      const updatedBill = await this.prisma.bill.update({
        where: {
          id,
        },
        data: {
          name,
          currency: currency ? this.getCurrencyInfo(currency)?.code : undefined,
        },
      });
      return {
        data: updatedBill,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
