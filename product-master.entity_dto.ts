import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateStoneDto {
  @ApiProperty({ example: 'Round' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  shape: string;

  @ApiProperty({ example: 'Diamond' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  stoneName: string;

  @ApiProperty({ example: 'Brilliant' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  cutStyle: string;

  @ApiPropertyOptional({ example: 'South Africa' })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  origin?: string;

  @ApiPropertyOptional({ example: 'VS1' })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  clarity?: string;

  @ApiPropertyOptional({ example: 'D' })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  colour?: string;

  @ApiProperty({ example: 'Natural' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  stoneType: string;

  @ApiPropertyOptional({ example: 'Excellent' })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  cutGrade?: string;

  @ApiPropertyOptional({ example: 'South Africa' })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  countryOrigin?: string;

  @ApiPropertyOptional({ example: 'None' })
  @IsString()
  @IsOptional()
  @MaxLength(200)
  enhancementTreatment?: string;

  @ApiPropertyOptional({ example: 'import_batch_001.csv' })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  sourceFile?: string;

  @ApiPropertyOptional({ example: '1.00-2.00 ct' })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  sizeRange?: string;

  @ApiPropertyOptional({ example: 5.25 })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  length?: number;

  @ApiPropertyOptional({ example: 5.25 })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  width?: number;

  @ApiPropertyOptional({ example: 3.15 })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  height?: number;

  @ApiPropertyOptional({ example: 1.25 })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  estimatedWeightInCt?: number;

  @ApiPropertyOptional({ example: 5000.00 })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  pricePerCt?: number;

  @ApiPropertyOptional({ example: 6000.00 })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  pricePerCtUsd?: number;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  is_active?: boolean;
}


import { PartialType } from '@nestjs/swagger';
import { CreateStoneDto } from './create-stone.dto';

export class UpdateStoneDto extends PartialType(CreateStoneDto) {}




import { Column, Entity, PrimaryGeneratedColumn, BeforeInsert, BeforeUpdate } from 'typeorm';

@Entity()
export class Stone {
  @PrimaryGeneratedColumn()
  id: number;

  // String fields
  @Column({ length: 100, type: 'varchar' })
  shape: string;

  @Column({ length: 100, type: 'varchar' })
  stoneName: string;

  @Column({ length: 100, type: 'varchar' })
  cutStyle: string;

  @Column({ length: 100, type: 'varchar', nullable: true })
  origin: string;

  @Column({ length: 100, type: 'varchar', nullable: true })
  clarity: string;

  @Column({ length: 100, type: 'varchar', nullable: true })
  colour: string;

  @Column({ length: 100, type: 'varchar' })
  stoneType: string;

  @Column({ length: 100, type: 'varchar', nullable: true })
  cutGrade: string;

  @Column({ length: 100, type: 'varchar', nullable: true })
  countryOrigin: string;

  @Column({ length: 200, type: 'varchar', nullable: true })
  enhancementTreatment: string;

  @Column({ length: 255, type: 'varchar', nullable: true })
  sourceFile: string;

  @Column({ length: 100, type: 'varchar', nullable: true })
  sizeRange: string;

  // Number fields
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  length: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  width: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  height: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  estimatedWeightInCt: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  pricePerCt: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  pricePerCtUsd: number;

  // Generated key field
  @Column({ length: 500, type: 'varchar', unique: true })
  generatedKey: string;

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

  @BeforeInsert()
  @BeforeUpdate()
  generateKey() {
    const formatDimension = (value: number | null | undefined): string => {
      return value !== null && value !== undefined ? Number(value).toFixed(2) : '0.00';
    };

    const parts = [
      this.stoneName || '',
      this.shape || '',
      this.stoneType || '',
      this.cutStyle || '',
      this.cutGrade || '',
      this.colour || '',
      this.enhancementTreatment || '',
      `${formatDimension(this.length)}x${formatDimension(this.width)}x${formatDimension(this.height)}`,
    ];

    this.generatedKey = parts.join('-');
  }
}
