import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ItemDropdowns, MaterialRequestType, ValuationMethod, BarcodeType, MaterialRequestTypeLabels, ValuationMethodLabels } from '../../../item.models';
import { IItem, IItemBarcode } from '../../../item.response';

export interface ItemInventoryPayload {
  shelf_life_in_days: number;
  end_of_life: string;
  default_material_request_type: string;
  valuation_method: string;
  warranty_period_in_days: number;
  weight_per_unit: number;
  weight_uom_id: number | null;
  allow_negative_stock: boolean;
  barcodes: { barcode: string; barcode_type?: string; uom_id?: number }[];
}

export interface ItemBarcodeRow {
  id: number;
  barcode: string;
  barcode_type: string;
  uom_id: number | null;
}

interface InventoryForm {
  shelf_life_in_days: FormControl<number>;
  end_of_life: FormControl<string>;
  default_material_request_type: FormControl<string>;
  valuation_method: FormControl<string>;
  warranty_period_in_days: FormControl<number>;
  weight_per_unit: FormControl<number>;
  weight_uom_id: FormControl<number | null>;
  allow_negative_stock: FormControl<boolean>;
}

@Component({
  selector: 'app-inventory-tab',
  imports: [ReactiveFormsModule],
  templateUrl: './inventory-tab.html',
})
export class InventoryTab implements OnChanges {
  @Input() item: IItem | null = null;
  @Input() dropdowns: ItemDropdowns | null = null;
  @Input() isSaving = false;
  @Output() save = new EventEmitter<ItemInventoryPayload>();

  readonly materialRequestTypes = Object.values(MaterialRequestType);
  readonly valuationMethods = Object.values(ValuationMethod);
  readonly barcodeTypes = Object.values(BarcodeType);
  readonly MaterialRequestTypeLabels = MaterialRequestTypeLabels;
  readonly ValuationMethodLabels = ValuationMethodLabels;

  form = new FormGroup<InventoryForm>({
    shelf_life_in_days: new FormControl<number>(0, { nonNullable: true, validators: [Validators.min(0)] }),
    end_of_life: new FormControl<string>('', { nonNullable: true }),
    default_material_request_type: new FormControl<string>(MaterialRequestType.PURCHASE, { nonNullable: true }),
    valuation_method: new FormControl<string>('', { nonNullable: true }),
    warranty_period_in_days: new FormControl<number>(0, { nonNullable: true, validators: [Validators.min(0)] }),
    weight_per_unit: new FormControl<number>(0, { nonNullable: true, validators: [Validators.min(0)] }),
    weight_uom_id: new FormControl<number | null>(null),
    allow_negative_stock: new FormControl<boolean>(false, { nonNullable: true }),
  });

  barcodes = signal<ItemBarcodeRow[]>([]);
  editingBarcodeId = signal<number | null>(null);

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['item'] && this.item) {
      this.form.patchValue({
        shelf_life_in_days: this.item.shelf_life_in_days,
        end_of_life: this.item.end_of_life,
        default_material_request_type: this.item.default_material_request_type,
        valuation_method: this.item.valuation_method ?? '',
        warranty_period_in_days: this.item.warranty_period_in_days ?? 0,
        weight_per_unit: this.item.weight_per_unit,
        weight_uom_id: this.item.weight_uom_id,
        allow_negative_stock: this.item.allow_negative_stock,
      });
      this.barcodes.set((this.item.barcodes ?? []).map(b => ({
        id: b.id, barcode: b.barcode, barcode_type: b.barcode_type ?? '', uom_id: b.uom_id,
      })));
    }
  }

  addBarcode(): void {
    const row: ItemBarcodeRow = { id: Date.now(), barcode: '', barcode_type: '', uom_id: null };
    this.barcodes.update(b => [...b, row]);
    this.editingBarcodeId.set(row.id);
  }

  editBarcode(id: number): void { this.editingBarcodeId.set(id); }
  cancelBarcodeEdit(): void { this.editingBarcodeId.set(null); }

  deleteBarcode(id: number): void {
    this.barcodes.update(b => b.filter(bc => bc.id !== id));
  }

  updateBarcodeField(id: number, field: keyof ItemBarcodeRow, value: any): void {
    this.barcodes.update(bcs => bcs.map(bc => bc.id === id ? { ...bc, [field]: value } : bc));
  }

  getUomName(id: number): string {
    return this.dropdowns?.uoms.find(u => u.id === id)?.name ?? '—';
  }

  onSave(): void {
    const raw = this.form.getRawValue();
    this.save.emit({
      ...raw,
      barcodes: this.barcodes().map(b => ({
        barcode: b.barcode,
        ...(b.barcode_type ? { barcode_type: b.barcode_type } : {}),
        ...(b.uom_id ? { uom_id: b.uom_id } : {}),
      })),
    });
  }

  get f() { return this.form.controls; }
}
