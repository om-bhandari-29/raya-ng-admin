import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  signal,
  OnInit,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ItemDropdowns } from '../../../item.models';
import { IItem } from '../../../item.response';
import {
  IItemAttribute,
  IItemAttributeValue,
} from '../../../../item-attribute/item-attribute.response';
import { ItemVariantRow, ItemVariantsPayload, VariantWeightForm } from './variants-tab.model';
import { IComboItem } from '../../../../../core/response/combo.interface';
import { Base } from '../../../../../core/base/base';
import {
  IGenericListResponse,
  IGenericResponse,
} from '../../../../../core/response/genericResponse.interface';
import {
  SearchableDropdown,
  ISearchableDropdownItem,
} from '../../../../../core/component/searchable-dropdown/searchable-dropdown';

@Component({
  selector: 'app-variants-tab',
  imports: [ReactiveFormsModule, SearchableDropdown],
  templateUrl: './variants-tab.html',
})
export class VariantsTab extends Base implements OnChanges, OnInit {
  @Input() item: IItem | null = null;
  @Input() dropdowns: ItemDropdowns | null = null;
  @Input() isSaving = false;
  @Output() save = new EventEmitter<ItemVariantsPayload>();

  public variantRows = signal<ItemVariantRow[]>([]);
  variantModalOpen = signal<boolean>(false);
  variantModalId = signal<number>(0);
  public attributeValueOptions = signal<IComboItem[]>([]);
  public productMasterOptions = signal<IComboItem[]>([]);

  public variantForm = new FormGroup({
    id: new FormControl<number>(0),
    variant_of_id: new FormControl<IComboItem | null>(null),
    attribute_value: new FormControl<string | null>(null),
    attribute_master_id: new FormControl<IComboItem | null>(null, [Validators.required]),
    attribute_master_value: new FormControl<string>('', { nonNullable: true }),
    is_disabled: new FormControl<boolean>(false, { nonNullable: true }),
    value: new FormControl<string | null>(null),
    stone_id: new FormControl<string>('', { nonNullable: true }),
    stone_family: new FormControl<string>('', { nonNullable: true }),
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

  override ngOnInit(): void {
    this.loadAttributeValueOptions();
    this.loadProductMasterOptions();
  }
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
          attribute_value: v.attribute_value,
          attribute_master_id: v.attribute_master_id,
          attribute_master_value: v.attribute_master_value,
          is_disabled: v.is_disabled,
          value: v.value ?? null,
          stone_family: v.stone_family ?? '',
          stone_id: v.stone_id ?? '',
        })),
      );
    }
  }

  public addVariant(): void {
    this.variantForm.reset({
      id: 0,
      variant_of_id: null,
      attribute_value: '',
      attribute_master_id: null,
      attribute_master_value: '',
      is_disabled: false,
      value: null,
      stone_id: '',
      stone_family: '',
    });
    // this.variantModalId.set(this.variantForm.getRawValue().id);
    // this.variantModalIsNew.set(true);
    this.variantModalOpen.set(true);
  }

  openModal(id: number): void {
    const row = this.variantRows().find((r) => r.id === id);
    if (!row) return;
    // this.variantForm.patchValue({
    //   ...row,
    //   variant_of_id: this.findDropdownItem(this.productMasterOptions(), row.variant_of_id),
    //   attribute_id: this.findDropdownItem(this.itemAttributes, row.attribute_id),
    // });
    this.variantModalId.set(id);
    // this.variantModalIsNew.set(false);
    this.variantModalOpen.set(true);
  }

  public onAttributeChange(selectedAttribute: IComboItem | null): void {
    if(selectedAttribute) {
      this.variantForm.controls.attribute_master_value.setValue(selectedAttribute.name);
    } else {
      this.variantForm.controls.attribute_master_value.setValue('');
    }
  }
  closeModal(): void {
    this.variantModalOpen.set(false);
  }

  public confirmModal(): void {
    this.variantForm.markAllAsTouched();
    const raw = this.variantForm.getRawValue();
    this.variantRows.update((variant) => [...variant,  raw as ItemVariantRow]);
    this.variantModalOpen.set(false);
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

  onSave(): void {
    const variants = this.variantRows();
    const raw = this.weightForm.getRawValue();

    console.log('variant ->', variants);
    console.log('weight form ->', raw);
  }

  public onAttributeSearch(searchText: string): void {
    this.loadAttributeValueOptions(searchText);
  }
  public onProductMasterSearch(searchText: string): void {
    this.loadProductMasterOptions(searchText);
  }

  private loadProductMasterOptions(search: string = ''): void {
    this.httpGetPromise<IGenericListResponse<IComboItem>>(
      this.apiRoutes.product_master.COMBO(),
      false,
      { search, page: 1, limit: 20 },
    )
      .then((response) => {
        if (response.status) {
          this.productMasterOptions.set(response.data.items);
        } else {
          this.productMasterOptions.set([]);
        }
      })
      .catch(() => {
        this.productMasterOptions.set([]);
      });
  }

  private loadAttributeValueOptions(search: string = ''): void {
    const paginationParams = { search: search, page: 1, limit: 20 };
    this.httpGetPromise<IGenericListResponse<IComboItem>>(
      this.apiRoutes.item_attribute.COMBO,
      false,
      paginationParams,
    )
      .then((response) => {
        if (response.status) {
          this.attributeValueOptions.set(response.data.items);
        } else {
          this.attributeValueOptions.set([]);
        }
      })
      .catch(() => {
        this.attributeValueOptions.set([]);
      });
  }
}
