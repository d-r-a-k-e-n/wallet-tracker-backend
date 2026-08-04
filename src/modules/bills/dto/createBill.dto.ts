import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateBillDto {
  @ApiProperty({
    example: 'Cash',
    description: 'Bill name',
  })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({
    example: 'USD',
    description: 'Currency code (ISO 4217)',
  })
  @IsString()
  @IsNotEmpty()
  currency!: string;
}
