import {
  Controller,
  Get,
  Req,
  UseGuards,
  Delete,
  Param,
  Post,
  Body,
  Patch,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCookieAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { BillsService } from './bills.service';
import type { IRequestUser } from '../auth/types/requestUser.type';
import { JwtUserGuard } from '../auth/guards/jwtUser.guard';
import { CreateBillDto } from './dto/createBill.dto';
import { UpdateBillDto } from './dto/updateBill.dto';

@ApiTags('Bills')
@ApiBearerAuth('access-token')
@ApiCookieAuth('accessToken')
@Controller('bills')
@UseGuards(JwtUserGuard)
export class BillsController {
  constructor(private readonly billsService: BillsService) {}

  @Get()
  @ApiOperation({ summary: 'Get current user bills' })
  @ApiResponse({
    status: 200,
    description: 'List of bills for the authenticated user',
    schema: {
      example: {
        data: [
          {
            id: 'clx123',
            name: 'Cash',
            currency: 'USD',
            userId: 'clxuser',
            createdAt: '2026-01-01T00:00:00.000Z',
            updatedAt: '2026-01-01T00:00:00.000Z',
          },
        ],
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getMyBills(@Req() req: IRequestUser) {
    return await this.billsService.getMyBills(req.user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a bill by id' })
  @ApiParam({ name: 'id', description: 'Bill id', example: 'clx123' })
  @ApiResponse({
    status: 200,
    description: 'Bill deleted successfully',
    schema: {
      example: { message: 'Bill deleted successfully' },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async deleteBill(@Param('id') id: string) {
    return await this.billsService.deleteBill(id);
  }

  @Post('')
  @ApiOperation({ summary: 'Create a new bill' })
  @ApiBody({ type: CreateBillDto })
  @ApiResponse({
    status: 201,
    description: 'Bill created successfully',
    schema: {
      example: { message: 'Bill created successfully' },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async createBill(
    @Req() req: IRequestUser,
    @Body() createBillDto: CreateBillDto,
  ) {
    return await this.billsService.createBill(req.user.id, createBillDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a bill by id' })
  @ApiParam({ name: 'id', description: 'Bill id', example: 'clx123' })
  @ApiBody({ type: UpdateBillDto })
  @ApiResponse({
    status: 200,
    description: 'Bill updated successfully',
    schema: {
      example: { message: 'Bill updated successfully' },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async updateBill(
    @Param('id') id: string,
    @Body() updateBillDto: UpdateBillDto,
  ) {
    return await this.billsService.updateBill(id, { ...updateBillDto });
  }
}
