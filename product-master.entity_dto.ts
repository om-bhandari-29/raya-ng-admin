import { IsBoolean, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateStoneMasterDto {
  @ApiProperty({ example: 'Diamond' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  is_published?: boolean;
}


import { PartialType } from '@nestjs/swagger';
import { CreateStoneMasterDto } from './create-stone-master.dto';

export class UpdateStoneMasterDto extends PartialType(CreateStoneMasterDto) {}


import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('stone_clarity')
export class StoneClarity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255, type: 'varchar' })
  name: string;

  @Column({ type: 'boolean', default: true })
  is_published: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;
}


import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('stone_family')
export class StoneFamily {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255, type: 'varchar' })
  name: string;

  @Column({ type: 'boolean', default: true })
  is_published: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;
}


import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('stone_shape')
export class StoneShape {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255, type: 'varchar' })
  name: string;

  @Column({ type: 'boolean', default: true })
  is_published: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;
}


