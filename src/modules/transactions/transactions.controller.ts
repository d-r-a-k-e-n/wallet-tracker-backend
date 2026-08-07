import { Controller, UseGuards, Get, Req } from '@nestjs/common';
import { JwtUserGuard } from '../auth/guards/jwtUser.guard';
import { TransactionsService } from './transactions.service';
import type { IRequestUser } from '../auth/types/requestUser.type';

@Controller('transactions')
@UseGuards(JwtUserGuard)
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get()
  async getMyTransactions(@Req() req: IRequestUser) {
    return this.transactionsService.getMyTransactions(req.user.id);
  }
}
