import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { CreateItemAttributeValueDto } from './create-item-attribute-value.dto';

export class CreateItemAttributeMasterDto {
  @ApiProperty({ example: 'Metal Type' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  attribute_name: string;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  status?: boolean;

  @ApiPropertyOptional({ example: false })
  @IsBoolean()
  @IsOptional()
  is_base_attribute?: boolean;

  @ApiPropertyOptional({ example: false })
  @IsBoolean()
  @IsOptional()
  numeric_values?: boolean;

  @ApiPropertyOptional({ type: [CreateItemAttributeValueDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateItemAttributeValueDto)
  @IsOptional()
  values?: CreateItemAttributeValueDto[];
}


import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateItemAttributeValueDto {
  @ApiProperty({ example: 'Gold' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  attribute_value: string;

  @ApiPropertyOptional({ example: 'Metal' })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  attribute_type?: string;

  @ApiPropertyOptional({ example: 'GL' })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  abbreviation?: string;

  @ApiPropertyOptional({ example: 0 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  purity_factor?: number;
}


import { PartialType } from '@nestjs/swagger';
import { CreateItemAttributeMasterDto } from './create-item-attribute-master.dto';

export class UpdateItemAttributeMasterDto extends PartialType(
  CreateItemAttributeMasterDto,
) {}



import { PartialType } from '@nestjs/swagger';
import { CreateItemAttributeValueDto } from './create-item-attribute-value.dto';

export class UpdateItemAttributeValueDto extends PartialType(
  CreateItemAttributeValueDto,
) {}


import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ItemAttributeValue } from './item-attribute-value.entity';

@Entity('item_attribute_master')
export class ItemAttributeMaster {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255, type: 'varchar' })
  attribute_name: string;

  @Column({ type: 'boolean', default: true })
  status: boolean;

  @Column({ type: 'boolean', default: false })
  is_base_attribute: boolean;

  @Column({ type: 'boolean', default: false })
  numeric_values: boolean;

  @OneToMany(() => ItemAttributeValue, (value) => value.attribute, {
    cascade: true,
  })
  values: ItemAttributeValue[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;
}


import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ItemAttributeMaster } from './item-attribute-master.entity';

@Entity('item_attribute_value')
export class ItemAttributeValue {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ItemAttributeMaster, (attr) => attr.values, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'attribute_id' })
  attribute: ItemAttributeMaster;

  @Column({ type: 'int' })
  attribute_id: number;

  @Column({ length: 255, type: 'varchar' })
  attribute_value: string;

  @Column({ length: 100, type: 'varchar', nullable: true })
  attribute_type: string | null;

  @Column({ length: 50, type: 'varchar', nullable: true })
  abbreviation: string | null;

  @Column({ type: 'decimal', precision: 5, scale: 3, default: 0 })
  purity_factor: number;
}
