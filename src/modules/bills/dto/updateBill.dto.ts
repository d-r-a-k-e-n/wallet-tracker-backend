import { PartialType } from '@nestjs/mapped-types';
import { CreateBillDto } from './createBill.dto';

export class UpdateBillDto extends PartialType(CreateBillDto) {}
