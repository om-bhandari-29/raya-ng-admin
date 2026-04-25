import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUomDto {
  @ApiProperty({ example: 'Kilogram' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  name: string;

  @ApiPropertyOptional({ example: 'Unit of weight measurement' })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  description?: string;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  is_active?: boolean;
}


import { PartialType } from '@nestjs/swagger';
import { CreateUomDto } from './create-uom.dto';

export class UpdateUomDto extends PartialType(CreateUomDto) {}


import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('uom')
export class Uom {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50, type: 'varchar', unique: true })
  name: string;

  @Column({ length: 255, type: 'varchar', nullable: true })
  description: string;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;
}
