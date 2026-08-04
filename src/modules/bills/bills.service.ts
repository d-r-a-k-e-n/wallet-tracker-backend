import { Injectable, BadRequestException } from '@nestjs/common';
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
    return await this.prisma.bill.findMany({
      where: {
        userId,
      },
    });
  }

  async deleteBill(id: string) {
    await this.prisma.bill.deleteMany({
      where: {
        id,
      },
    });
  }

  async createBill(userId: string, { name, currency }: CreateBillDto) {
    return await this.prisma.bill.create({
      data: {
        userId,
        name,
        currency: this.getCurrencyInfo(currency).code,
      },
    });
  }

  async updateBill(id: string, { name, currency }: UpdateBillDto) {
    return await this.prisma.bill.update({
      where: {
        id,
      },
      data: {
        name,
        currency: currency ? this.getCurrencyInfo(currency)?.code : undefined,
      },
    });
  }
}
