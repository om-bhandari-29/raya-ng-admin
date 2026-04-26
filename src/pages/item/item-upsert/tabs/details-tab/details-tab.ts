import { Component, Input, OnChanges, SimpleChanges, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IItem } from '../../../item.response';
import { ItemDropdowns } from '../../../item.models';

export interface ItemDetailsForm {
  product_master_id: FormControl<number | null>;
  item_name: FormControl<string>;
  item_group_id: FormControl<number | null>;
  hsn_sac: FormControl<string>;
  default_uom_id: FormControl<number | null>;
  fixed_qty: FormControl<number>;
  is_disabled: FormControl<boolean>;
  allow_alternative_item: FormControl<boolean>;
  maintain_stock: FormControl<boolean>;
  is_in_stock: FormControl<boolean>;
  has_variants: FormControl<boolean>;
  estimated_delivery_days: FormControl<number>;
  valuation_rate: FormControl<number>;
  is_fixed_asset: FormControl<boolean>;
  over_delivery_receipt_allowance: FormControl<number>;
  over_billing_allowance: FormControl<number>;
  description: FormControl<string>;
}

@Component({
  selector: 'app-details-tab',
  imports: [ReactiveFormsModule],
  templateUrl: './details-tab.html',
})
export class DetailsTab implements OnChanges {
  @Input() item: IItem | null = null;
  @Input() dropdowns: ItemDropdowns | null = null;

  form = new FormGroup<ItemDetailsForm>({
    product_master_id: new FormControl<number | null>(null),
    item_name: new FormControl<string>('', { nonNullable: true, validators: [Validators.required, Validators.minLength(2)] }),
    item_group_id: new FormControl<number | null>(null, { validators: [Validators.required] }),
    hsn_sac: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    default_uom_id: new FormControl<number | null>(null, { validators: [Validators.required] }),
    fixed_qty: new FormControl<number>(0, { nonNullable: true, validators: [Validators.required, Validators.min(0)] }),
    is_disabled: new FormControl<boolean>(false, { nonNullable: true }),
    allow_alternative_item: new FormControl<boolean>(false, { nonNullable: true }),
    maintain_stock: new FormControl<boolean>(true, { nonNullable: true }),
    is_in_stock: new FormControl<boolean>(false, { nonNullable: true }),
    has_variants: new FormControl<boolean>(false, { nonNullable: true }),
    estimated_delivery_days: new FormControl<number>(0, { nonNullable: true, validators: [Validators.min(0)] }),
    valuation_rate: new FormControl<number>(0, { nonNullable: true, validators: [Validators.min(0)] }),
    is_fixed_asset: new FormControl<boolean>(false, { nonNullable: true }),
    over_delivery_receipt_allowance: new FormControl<number>(0, { nonNullable: true, validators: [Validators.min(0)] }),
    over_billing_allowance: new FormControl<number>(0, { nonNullable: true, validators: [Validators.min(0)] }),
    description: new FormControl<string>('', { nonNullable: true }),
  });

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['item'] && this.item) {
      this.form.patchValue({ ...this.item, description: this.item.description ?? '' });
    }
  }

  get f() { return this.form.controls; }
}
