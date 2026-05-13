import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  signal,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ItemDropdowns } from '../../../item.models';
import { IItem } from '../../../item.response';
import {
  IItemAttribute,
  IItemAttributeValue,
} from '../../../../item-attribute/item-attribute.response';

export interface ItemVariantRow {
  id: number;
  variant_of_id: number | null;
  attribute_id: number | null;
  value_id: number | null;
  is_disabled: boolean;
  stone_family: string;
  stone_id: string;
}

export interface ItemVariantsPayload {
  stones: string;
  gross_weight: number;
  net_weight: number;
  stones_weight_in_gram: number;
  stone_carat_wt: number;
  pure_weight_metal: number;
  labor_rate: number;
  variants: {
    attribute_id: number;
    value_id: number;
    variant_of_id?: number;
    is_disabled?: boolean;
    stone_family?: string;
    stone_id?: string;
  }[];
}

interface VariantWeightForm {
  gross_weight: FormControl<number>;
  net_weight: FormControl<number>;
  stones_weight_in_gram: FormControl<number>;
  stone_carat_wt: FormControl<number>;
  pure_weight_metal: FormControl<number>;
  labor_rate: FormControl<number>;
  stones: FormControl<string>;
}

@Component({
  selector: 'app-variants-tab',
  imports: [ReactiveFormsModule],
  templateUrl: './variants-tab.html',
})
export class VariantsTab implements OnChanges {
  @Input() item: IItem | null = null;
  @Input() dropdowns: ItemDropdowns | null = null;
  @Input() isSaving = false;
  @Output() save = new EventEmitter<ItemVariantsPayload>();

  variantRows = signal<ItemVariantRow[]>([]);
  variantModalOpen = signal<boolean>(false);
  variantModalIsNew = signal<boolean>(false);
  variantModalId = signal<number>(0);
  variantModalDraft = signal<ItemVariantRow>({
    id: 0,
    variant_of_id: null,
    attribute_id: null,
    value_id: null,
    is_disabled: false,
    stone_id: '',
    stone_family: '',
  });

  weightForm = new FormGroup<VariantWeightForm>({
    gross_weight: new FormControl<number>(0, {
      nonNullable: true,
      validators: [Validators.min(0)],
    }),
    net_weight: new FormControl<number>(0, { nonNullable: true, validators: [Validators.min(0)] }),
    stones_weight_in_gram: new FormControl<number>(0, {
      nonNullable: true,
      validators: [Validators.min(0)],
    }),
    stone_carat_wt: new FormControl<number>(0, {
      nonNullable: true,
      validators: [Validators.min(0)],
    }),
    pure_weight_metal: new FormControl<number>(0, {
      nonNullable: true,
      validators: [Validators.min(0)],
    }),
    labor_rate: new FormControl<number>(0, { nonNullable: true, validators: [Validators.min(0)] }),
    stones: new FormControl<string>('', { nonNullable: true }),
  });

  get itemAttributes(): IItemAttribute[] {
    return this.dropdowns?.itemAttributes ?? [];
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['item'] && this.item) {
      this.weightForm.patchValue({
        gross_weight: +this.item.gross_weight,
        net_weight: +this.item.net_weight,
        stones_weight_in_gram: +this.item.stones_weight_in_gram,
        stone_carat_wt: +this.item.stone_carat_wt,
        pure_weight_metal: +this.item.pure_weight_metal,
        labor_rate: +this.item.labor_rate,
        stones: this.item.stones ?? '',
      });
      this.variantRows.set(
        (this.item.variants ?? []).map((v) => ({
          id: v.id,
          variant_of_id: v.variant_of_id,
          attribute_id: v.attribute_id,
          value_id: v.value_id,
          is_disabled: v.is_disabled,
          stone_family: v.stone_family ?? '',
          stone_id: v.stone_id ?? '',
        })),
      );
    }
  }

  addVariant(): void {
    const draft: ItemVariantRow = {
      id: Date.now(),
      variant_of_id: null,
      attribute_id: null,
      value_id: null,
      is_disabled: false,
      stone_id: '',
      stone_family: '',
    };
    this.variantModalDraft.set(draft);
    this.variantModalId.set(draft.id);
    this.variantModalIsNew.set(true);
    this.variantModalOpen.set(true);
  }

  openModal(id: number): void {
    const row = this.variantRows().find((r) => r.id === id);
    if (!row) return;
    this.variantModalDraft.set({ ...row });
    this.variantModalId.set(id);
    this.variantModalIsNew.set(false);
    this.variantModalOpen.set(true);
  }

  closeModal(): void {
    this.variantModalOpen.set(false);
  }

  confirmModal(): void {
    const draft = this.variantModalDraft();
    if (this.variantModalIsNew()) {
      this.variantRows.update((v) => [...v, { ...draft }]);
    } else {
      this.variantRows.update((rows) => rows.map((r) => (r.id === draft.id ? { ...draft } : r)));
    }
    this.variantModalOpen.set(false);
  }

  updateDraft(field: keyof ItemVariantRow, value: any): void {
    this.variantModalDraft.update((d) => ({ ...d, [field]: value }));
  }

  deleteRow(id: number): void {
    this.variantRows.update((v) => v.filter((r) => r.id !== id));
  }

  getRowIndex(): number {
    return this.variantRows().findIndex((r) => r.id === this.variantModalId());
  }

  getAttributeValues(attributeId: number | null): IItemAttributeValue[] {
    if (!attributeId) return [];
    return this.itemAttributes.find((a) => a.id === attributeId)?.values ?? [];
  }

  getAttributeName(attributeId: number | null): string {
    if (!attributeId) return '—';
    return this.itemAttributes.find((a) => a.id === attributeId)?.name ?? '—';
  }

  getValueName(row: ItemVariantRow): string {
    const val = this.getAttributeValues(row.attribute_id).find((v) => v.id === row.value_id);
    return val?.attribute_value ?? '—';
  }

  onSave(): void {
    const raw = this.weightForm.getRawValue();
    this.save.emit({
      ...raw,
      variants: this.variantRows()
        .filter((r) => r.attribute_id && r.value_id)
        .map((r) => ({
          attribute_id: r.attribute_id!,
          value_id: r.value_id!,
          ...(r.variant_of_id ? { variant_of_id: r.variant_of_id } : {}),
          ...(r.is_disabled ? { is_disabled: r.is_disabled } : {}),
          ...(r.stone_family ? { stone_family: r.stone_family } : {}),
          ...(r.stone_id ? { stone_id: r.stone_id } : {}),
        })),
    });
  }
}
