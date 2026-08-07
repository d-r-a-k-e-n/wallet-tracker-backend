import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, IsNotEmpty, IsString } from 'class-validator';

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

  @ApiProperty({
    example: 1000,
    description: 'Balance',
  })
  @Transform(({ value }) => Number(value))
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsNotEmpty()
  balance!: number;
}
