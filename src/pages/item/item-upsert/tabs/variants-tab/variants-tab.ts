import { Component, Input, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ItemDropdowns } from '../../../item.models';
import { IItemAttribute, IItemAttributeValue } from '../../../../item-attribute/item-attribute.response';

export interface ItemVariantAttribute {
  id: number;
  attribute_id: number | null;
  attribute_value_id: number | null;
  attribute_value_ids: number[];
  variant_of: string;
  attribute_value_label: string;
  is_disabled: boolean;
  stone_id: string;
  stone_family: string;
}

export interface ItemVariantWeightForm {
  gross_weight: FormControl<number>;
  net_weight: FormControl<number>;
  stones_weight: FormControl<number>;
  stone_carat_wt: FormControl<number>;
  pure_weight_metal: FormControl<number>;
  labor_rate: FormControl<number>;
  labor_per_gram: FormControl<string>;
  stones: FormControl<string>;
}

@Component({
  selector: 'app-variants-tab',
  imports: [ReactiveFormsModule],
  templateUrl: './variants-tab.html',
})
export class VariantsTab {
  @Input() dropdowns: ItemDropdowns | null = null;

  variantAttributes = signal<ItemVariantAttribute[]>([]);
  variantModalOpen = signal<boolean>(false);
  variantModalIsNew = signal<boolean>(false);
  variantModalId = signal<number>(0);
  variantModalDraft = signal<ItemVariantAttribute>({
    id: 0, attribute_id: null, attribute_value_id: null, attribute_value_ids: [],
    variant_of: '', attribute_value_label: '', is_disabled: false, stone_id: '', stone_family: '',
  });

  weightForm = new FormGroup<ItemVariantWeightForm>({
    gross_weight: new FormControl<number>(0, { nonNullable: true, validators: [Validators.required, Validators.min(0)] }),
    net_weight: new FormControl<number>(0, { nonNullable: true, validators: [Validators.min(0)] }),
    stones_weight: new FormControl<number>(0, { nonNullable: true, validators: [Validators.min(0)] }),
    stone_carat_wt: new FormControl<number>(0, { nonNullable: true, validators: [Validators.min(0)] }),
    pure_weight_metal: new FormControl<number>(0, { nonNullable: true, validators: [Validators.min(0)] }),
    labor_rate: new FormControl<number>(0, { nonNullable: true, validators: [Validators.min(0)] }),
    labor_per_gram: new FormControl<string>('', { nonNullable: true }),
    stones: new FormControl<string>('', { nonNullable: true }),
  });

  get itemAttributes(): IItemAttribute[] { return this.dropdowns?.itemAttributes ?? []; }

  addVariant(): void {
    const draft: ItemVariantAttribute = {
      id: Date.now(), attribute_id: null, attribute_value_id: null, attribute_value_ids: [],
      variant_of: '', attribute_value_label: '', is_disabled: false, stone_id: '', stone_family: '',
    };
    this.variantModalDraft.set(draft);
    this.variantModalId.set(draft.id);
    this.variantModalIsNew.set(true);
    this.variantModalOpen.set(true);
  }

  openModal(id: number): void {
    const row = this.variantAttributes().find(r => r.id === id);
    if (!row) return;
    this.variantModalDraft.set({ ...row });
    this.variantModalId.set(id);
    this.variantModalIsNew.set(false);
    this.variantModalOpen.set(true);
  }

  closeModal(): void { this.variantModalOpen.set(false); }

  confirmModal(): void {
    const draft = this.variantModalDraft();
    if (this.variantModalIsNew()) {
      this.variantAttributes.update(v => [...v, { ...draft }]);
    } else {
      this.variantAttributes.update(rows => rows.map(r => r.id === draft.id ? { ...draft } : r));
    }
    this.variantModalOpen.set(false);
  }

  updateDraft(field: keyof ItemVariantAttribute, value: any): void {
    this.variantModalDraft.update(d => ({ ...d, [field]: value }));
  }

  deleteRow(id: number): void {
    this.variantAttributes.update(v => v.filter(r => r.id !== id));
  }

  getRowIndex(): number {
    return this.variantAttributes().findIndex(r => r.id === this.variantModalId());
  }

  getAttributeValues(attributeId: number | null): IItemAttributeValue[] {
    if (!attributeId) return [];
    return this.itemAttributes.find(a => a.id === attributeId)?.values ?? [];
  }

  getAttributeName(attributeId: number | null): string {
    if (!attributeId) return '—';
    return this.itemAttributes.find(a => a.id === attributeId)?.attribute_name ?? '—';
  }

  getSelectedValueNames(row: ItemVariantAttribute): string {
    const values = this.getAttributeValues(row.attribute_id);
    return row.attribute_value_ids
      .map(id => values.find(v => v.id === id)?.attribute_value ?? '')
      .filter(Boolean).join(', ');
  }
}
