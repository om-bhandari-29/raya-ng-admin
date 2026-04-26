import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateItemBarcodeDto {
  @ApiProperty({ example: 'ABC123456789' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  barcode: string;

  @ApiPropertyOptional({ example: 'EAN' })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  barcode_type?: string;

  @ApiPropertyOptional({ example: 1 })
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  uom_id?: number;
}


import { IsInt, IsNotEmpty, IsNumber, IsOptional, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateItemStoneDetailDto {
  @ApiProperty({ example: 1, description: 'FK to stone_family' })
  @IsInt()
  @Type(() => Number)
  stone_family_id: number;

  @ApiPropertyOptional({ example: 1, description: 'FK to stone_clarity' })
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  stone_clarity_id?: number;

  @ApiProperty({ example: 1, description: 'FK to stone_shape' })
  @IsInt()
  @Type(() => Number)
  stone_shape_id: number;

  @ApiProperty({ example: 0.5 })
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  @Type(() => Number)
  weight_carat: number;
}


import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateItemVariantDto {
  @ApiPropertyOptional({ example: 1, description: 'FK to item (variant of)' })
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  variant_of_id?: number;

  @ApiProperty({ example: 1, description: 'FK to item_attribute_master' })
  @IsInt()
  @Type(() => Number)
  attribute_id: number;

  @ApiProperty({ example: 1, description: 'FK to item_attribute_value (must belong to selected attribute)' })
  @IsInt()
  @Type(() => Number)
  value_id: number;

  @ApiPropertyOptional({ example: false })
  @IsBoolean()
  @IsOptional()
  is_disabled?: boolean;

  @ApiPropertyOptional({ example: 'Diamond' })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  stone_family?: string;

  @ApiPropertyOptional({ example: 'STN-001' })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  stone_id?: string;
}


import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { MaterialRequestTypeEnum } from '../../../core/enum/material-request-type.enum';
import { ValuationMethodEnum } from '../../../core/enum/valuation-method.enum';
import { CreateItemBarcodeDto } from './create-item-barcode.dto';
import { CreateItemVariantDto } from './create-item-variant.dto';
import { CreateItemStoneDetailDto } from './create-item-stone-detail.dto';

export class CreateItemDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  @Type(() => Number)
  product_master_id: number;

  @ApiProperty({ example: 'White Gold Oval Hoop Earrings in Sterling Silver' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @ApiProperty({ example: 1 })
  @IsInt()
  @Type(() => Number)
  item_group_id: number;

  @ApiPropertyOptional({ example: 1 })
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  hsn_sac_id?: number;

  @ApiPropertyOptional({ example: 1 })
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  default_uom_id?: number;

  @ApiPropertyOptional({ example: 0 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  fixed_qty?: number;

  @ApiPropertyOptional({ example: false })
  @IsBoolean()
  @IsOptional()
  is_disabled?: boolean;

  @ApiPropertyOptional({ example: false })
  @IsBoolean()
  @IsOptional()
  allow_alternative_item?: boolean;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  maintain_stock?: boolean;

  @ApiPropertyOptional({ example: false })
  @IsBoolean()
  @IsOptional()
  is_in_stock?: boolean;

  @ApiPropertyOptional({ example: false })
  @IsBoolean()
  @IsOptional()
  has_variants?: boolean;

  @ApiPropertyOptional({ example: 0 })
  @IsInt()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  estimated_delivery_days?: number;

  @ApiPropertyOptional({ example: 0 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  valuation_rate?: number;

  @ApiPropertyOptional({ example: false })
  @IsBoolean()
  @IsOptional()
  is_fixed_asset?: boolean;

  @ApiPropertyOptional({ example: 0 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  over_delivery_receipt_allowance?: number;

  @ApiPropertyOptional({ example: 0 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  over_billing_allowance?: number;

  @ApiPropertyOptional({ example: 'A beautiful pair of earrings' })
  @IsString()
  @IsOptional()
  description?: string;

  // Inventory Settings
  @ApiPropertyOptional({ example: 0 })
  @IsInt()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  shelf_life_in_days?: number;

  @ApiPropertyOptional({ example: 365 })
  @IsInt()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  warranty_period_in_days?: number;

  @ApiPropertyOptional({ example: '2099-12-31' })
  @IsDateString()
  @IsOptional()
  end_of_life?: string;

  @ApiPropertyOptional({ example: 0.0 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  weight_per_unit?: number;

  @ApiPropertyOptional({ example: 1 })
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  weight_uom_id?: number;

  @ApiPropertyOptional({ enum: MaterialRequestTypeEnum, example: MaterialRequestTypeEnum.purchase })
  @IsEnum(MaterialRequestTypeEnum)
  @IsOptional()
  default_material_request_type?: MaterialRequestTypeEnum;

  @ApiPropertyOptional({ enum: ValuationMethodEnum, example: ValuationMethodEnum.fifo })
  @IsEnum(ValuationMethodEnum)
  @IsOptional()
  valuation_method?: ValuationMethodEnum;

  @ApiPropertyOptional({ example: false })
  @IsBoolean()
  @IsOptional()
  allow_negative_stock?: boolean;

  @ApiPropertyOptional({ type: [CreateItemBarcodeDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateItemBarcodeDto)
  @IsOptional()
  barcodes?: CreateItemBarcodeDto[];

  // Variants tab
  @ApiPropertyOptional({ example: 'Diamond' })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  stones?: string;

  @ApiPropertyOptional({ example: 4.54 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  gross_weight?: number;

  @ApiPropertyOptional({ example: 0 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  net_weight?: number;

  @ApiPropertyOptional({ example: 0 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  stones_weight_in_gram?: number;

  @ApiPropertyOptional({ example: 0 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  stone_carat_wt?: number;

  @ApiPropertyOptional({ example: 0 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  pure_weight_metal?: number;

  @ApiPropertyOptional({ example: 0 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  labor_rate?: number;

  @ApiPropertyOptional({ type: [CreateItemVariantDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateItemVariantDto)
  @IsOptional()
  variants?: CreateItemVariantDto[];

  // Stone Details
  @ApiPropertyOptional({ type: [CreateItemStoneDetailDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateItemStoneDetailDto)
  @IsOptional()
  stone_details?: CreateItemStoneDetailDto[];
}


import { PartialType } from '@nestjs/swagger';
import { CreateItemDto } from './create-item.dto';

export class UpdateItemDto extends PartialType(CreateItemDto) {}




import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Item } from './item.entity';
import { Uom } from '../../uom/entity/uom.entity';

@Entity('item_barcode')
export class ItemBarcode {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Item, (item) => item.barcodes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'item_id' })
  item: Item;

  @Column({ type: 'int' })
  item_id: number;

  @Column({ length: 255, type: 'varchar' })
  barcode: string;

  @Column({ length: 100, type: 'varchar', nullable: true })
  barcode_type: string | null;

  @ManyToOne(() => Uom, { nullable: true })
  @JoinColumn({ name: 'uom_id' })
  uom: Uom;

  @Column({ type: 'int', nullable: true })
  uom_id: number | null;
}


import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Item } from './item.entity';
import { StoneFamily } from '../../stone-master/entity/stone-family.entity';
import { StoneClarity } from '../../stone-master/entity/stone-clarity.entity';
import { StoneShape } from '../../stone-master/entity/stone-shape.entity';

@Entity('item_stone_detail')
export class ItemStoneDetail {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Item, (item) => item.stone_details, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'item_id' })
  item: Item;

  @Column({ type: 'int' })
  item_id: number;

  @ManyToOne(() => StoneFamily, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'stone_family_id' })
  stone_family: StoneFamily;

  @Column({ type: 'int' })
  stone_family_id: number;

  @ManyToOne(() => StoneClarity, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'stone_clarity_id' })
  stone_clarity: StoneClarity;

  @Column({ type: 'int', nullable: true })
  stone_clarity_id: number | null;

  @ManyToOne(() => StoneShape, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'stone_shape_id' })
  stone_shape: StoneShape;

  @Column({ type: 'int' })
  stone_shape_id: number;

  @Column({ type: 'decimal', precision: 10, scale: 3 })
  weight_carat: number;
}



import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Item } from './item.entity';
import { ItemAttributeMaster } from '../../item-attribute-master/entity/item-attribute-master.entity';
import { ItemAttributeValue } from '../../item-attribute-master/entity/item-attribute-value.entity';

@Entity('item_variant')
export class ItemVariant {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Item, (item) => item.variants, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'item_id' })
  item: Item;

  @Column({ type: 'int' })
  item_id: number;

  @ManyToOne(() => Item, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'variant_of_id' })
  variant_of: Item;

  @Column({ type: 'int', nullable: true })
  variant_of_id: number | null;

  @ManyToOne(() => ItemAttributeMaster, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'attribute_id' })
  attribute: ItemAttributeMaster;

  @Column({ type: 'int' })
  attribute_id: number;

  @ManyToOne(() => ItemAttributeValue, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'value_id' })
  value: ItemAttributeValue;

  @Column({ type: 'int' })
  value_id: number;

  @Column({ type: 'boolean', default: false })
  is_disabled: boolean;

  @Column({ length: 255, type: 'varchar', nullable: true })
  stone_family: string | null;

  @Column({ length: 255, type: 'varchar', nullable: true })
  stone_id: string | null;
}



import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProductMaster } from '../../product-master/entity/product-master.entity';
import { ItemGroup } from '../../item-group/entity/item-group.entity';
import { GstHsnCode } from '../../gst-hsn-code/entity/gst-hsn-code.entity';
import { Uom } from '../../uom/entity/uom.entity';
import { MaterialRequestTypeEnum } from '../../../core/enum/material-request-type.enum';
import { ValuationMethodEnum } from '../../../core/enum/valuation-method.enum';
import { ItemBarcode } from './item-barcode.entity';
import { ItemVariant } from './item-variant.entity';
import { ItemStoneDetail } from './item-stone-detail.entity';

@Entity('item')
export class Item {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ProductMaster)
  @JoinColumn({ name: 'product_master_id' })
  product_master: ProductMaster;

  @Column({ type: 'int' })
  product_master_id: number;

  @Column({ length: 255, type: 'varchar' })
  name: string;

  @ManyToOne(() => ItemGroup)
  @JoinColumn({ name: 'item_group_id' })
  item_group: ItemGroup;

  @Column({ type: 'int' })
  item_group_id: number;

  @ManyToOne(() => GstHsnCode, { nullable: true })
  @JoinColumn({ name: 'hsn_sac_id' })
  hsn_sac: GstHsnCode;

  @Column({ type: 'int', nullable: true })
  hsn_sac_id: number | null;

  @ManyToOne(() => Uom, { nullable: true })
  @JoinColumn({ name: 'default_uom_id' })
  default_uom: Uom;

  @Column({ type: 'int', nullable: true })
  default_uom_id: number | null;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  fixed_qty: number;

  @Column({ type: 'boolean', default: false })
  is_disabled: boolean;

  @Column({ type: 'boolean', default: false })
  allow_alternative_item: boolean;

  @Column({ type: 'boolean', default: true })
  maintain_stock: boolean;

  @Column({ type: 'boolean', default: false })
  is_in_stock: boolean;

  @Column({ type: 'boolean', default: false })
  has_variants: boolean;

  @Column({ type: 'int', default: 0 })
  estimated_delivery_days: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  valuation_rate: number;

  @Column({ type: 'boolean', default: false })
  is_fixed_asset: boolean;

  @Column({ type: 'decimal', precision: 5, scale: 3, default: 0 })
  over_delivery_receipt_allowance: number;

  @Column({ type: 'decimal', precision: 5, scale: 3, default: 0 })
  over_billing_allowance: number;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  // Inventory Settings
  @Column({ type: 'int', default: 0 })
  shelf_life_in_days: number;

  @Column({ type: 'int', nullable: true })
  warranty_period_in_days: number | null;

  @Column({ type: 'date', default: '2099-12-31' })
  end_of_life: string;

  @Column({ type: 'decimal', precision: 10, scale: 3, default: 0 })
  weight_per_unit: number;

  @ManyToOne(() => Uom, { nullable: true })
  @JoinColumn({ name: 'weight_uom_id' })
  weight_uom: Uom;

  @Column({ type: 'int', nullable: true })
  weight_uom_id: number | null;

  @Column({
    type: 'enum',
    enum: MaterialRequestTypeEnum,
    default: MaterialRequestTypeEnum.purchase,
  })
  default_material_request_type: MaterialRequestTypeEnum;

  @Column({
    type: 'enum',
    enum: ValuationMethodEnum,
    nullable: true,
  })
  valuation_method: ValuationMethodEnum | null;

  @Column({ type: 'boolean', default: false })
  allow_negative_stock: boolean;

  // Barcodes
  @OneToMany(() => ItemBarcode, (barcode) => barcode.item, { cascade: true })
  barcodes: ItemBarcode[];

  // Variants
  @Column({ type: 'varchar', length: 255, nullable: true })
  stones: string | null;

  @Column({ type: 'decimal', precision: 10, scale: 3, default: 0 })
  gross_weight: number;

  @Column({ type: 'decimal', precision: 10, scale: 3, default: 0 })
  net_weight: number;

  @Column({ type: 'decimal', precision: 10, scale: 3, default: 0 })
  stones_weight_in_gram: number;

  @Column({ type: 'decimal', precision: 10, scale: 3, default: 0 })
  stone_carat_wt: number;

  @Column({ type: 'decimal', precision: 10, scale: 3, default: 0 })
  pure_weight_metal: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  labor_rate: number;

  @OneToMany(() => ItemVariant, (variant) => variant.item, { cascade: true })
  variants: ItemVariant[];

  // Stone Details
  @OneToMany(() => ItemStoneDetail, (stone) => stone.item, { cascade: true })
  stone_details: ItemStoneDetail[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;
}


