import { Component, Input, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ItemDropdowns, MaterialRequestType, ValuationMethod, BarcodeType } from '../../../item.models';

export interface ItemBarcode {
  id: number;
  barcode: string;
  barcode_type: string;
  uom_id: number | null;
}

export interface ItemInventoryForm {
  shelf_life_in_days: FormControl<number>;
  end_of_life: FormControl<string>;
  default_material_request_type: FormControl<string>;
  valuation_method: FormControl<string>;
  warranty_period: FormControl<number>;
  weight_per_unit: FormControl<number>;
  weight_uom_id: FormControl<number | null>;
  allow_negative_stock: FormControl<boolean>;
}

@Component({
  selector: 'app-inventory-tab',
  imports: [ReactiveFormsModule],
  templateUrl: './inventory-tab.html',
})
export class InventoryTab {
  @Input() dropdowns: ItemDropdowns | null = null;

  readonly MaterialRequestType = MaterialRequestType;
  readonly ValuationMethod = ValuationMethod;
  readonly BarcodeType = BarcodeType;

  readonly materialRequestTypes = Object.values(MaterialRequestType);
  readonly valuationMethods = Object.values(ValuationMethod);
  readonly barcodeTypes = Object.values(BarcodeType);

  form = new FormGroup<ItemInventoryForm>({
    shelf_life_in_days: new FormControl<number>(0, { nonNullable: true, validators: [Validators.min(0)] }),
    end_of_life: new FormControl<string>('', { nonNullable: true }),
    default_material_request_type: new FormControl<string>(MaterialRequestType.PURCHASE, { nonNullable: true }),
    valuation_method: new FormControl<string>('', { nonNullable: true }),
    warranty_period: new FormControl<number>(0, { nonNullable: true, validators: [Validators.min(0)] }),
    weight_per_unit: new FormControl<number>(0, { nonNullable: true, validators: [Validators.min(0)] }),
    weight_uom_id: new FormControl<number | null>(null),
    allow_negative_stock: new FormControl<boolean>(false, { nonNullable: true }),
  });

  barcodes = signal<ItemBarcode[]>([]);
  editingBarcodeId = signal<number | null>(null);

  addBarcode(): void {
    const row: ItemBarcode = { id: Date.now(), barcode: '', barcode_type: '', uom_id: null };
    this.barcodes.update(b => [...b, row]);
    this.editingBarcodeId.set(row.id);
  }

  editBarcode(id: number): void { this.editingBarcodeId.set(id); }
  cancelBarcodeEdit(): void { this.editingBarcodeId.set(null); }

  deleteBarcode(id: number): void {
    this.barcodes.update(b => b.filter(bc => bc.id !== id));
  }

  updateBarcodeField(id: number, field: keyof ItemBarcode, value: any): void {
    this.barcodes.update(bcs => bcs.map(bc => bc.id === id ? { ...bc, [field]: value } : bc));
  }

  getUomName(id: number): string {
    return this.dropdowns?.uoms.find(u => u.id === id)?.name ?? '—';
  }

  get f() { return this.form.controls; }
}
