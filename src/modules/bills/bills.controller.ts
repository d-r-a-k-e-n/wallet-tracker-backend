import {
  Controller,
  Get,
  InternalServerErrorException,
  Req,
  UseGuards,
  Delete,
  Param,
  Post,
  Body,
  Patch,
} from '@nestjs/common';
import { BillsService } from './bills.service';
import type { IRequestUser } from '../auth/types/requestUser.type';
import { JwtUserGuard } from '../auth/guards/jwtUser.guard';
import { CreateBillDto } from './dto/createBill.dto';
import { UpdateBillDto } from './dto/updateBill.dto';

@Controller('bills')
@UseGuards(JwtUserGuard)
export class BillsController {
  constructor(private readonly billsService: BillsService) {}

  @Get()
  async getMyBills(@Req() req: IRequestUser) {
    try {
      const bills = await this.billsService.getMyBills(req.user.id);
      return {
        data: bills,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  @Delete(':id')
  async deleteBill(@Param('id') id: string) {
    try {
      await this.billsService.deleteBill(id);
      return {
        message: 'Bill deleted successfully',
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  @Post('')
  async createBill(
    @Req() req: IRequestUser,
    @Body() createBillDto: CreateBillDto,
  ) {
    try {
      await this.billsService.createBill(req.user.id, createBillDto);
      return {
        message: 'Bill created successfully',
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  @Patch(':id')
  async updateBill(
    @Param('id') id: string,
    @Body() updateBillDto: UpdateBillDto,
  ) {
    try {
      await this.billsService.updateBill(id, { ...updateBillDto });
      return {
        message: 'Bill updated successfully',
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
