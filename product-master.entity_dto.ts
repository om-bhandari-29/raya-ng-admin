export class CreateGstHsnCodeDto {
  @ApiProperty({ example: '8471' })
  @IsString()
  @IsNotEmpty()
  hsn_code: string;

  @ApiProperty({ example: 'Automatic data processing machines and units' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 18.0 })
  @IsNumber()
  @Min(0)
  @Max(100)
  @Type(() => Number)
  gst_rate: number;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  is_active?: boolean;
}


export class UpdateGstHsnCodeDto extends PartialType(CreateGstHsnCodeDto) {}


import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('gst_hsn_code')
export class GstHsnCode {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 20, type: 'varchar', unique: true })
  hsn_code: string;

  @Column({ length: 255, type: 'varchar' })
  description: string;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  gst_rate: number;

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
