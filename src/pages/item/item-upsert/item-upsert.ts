import { Component, OnInit, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Base } from '../../../core/base/base';
import { IGenericResponse } from '../../../core/response/genericResponse.interface';
import { IItem } from '../item.response';
import { IGroupItem } from '../../group-item/group-item.response';
import { IProductMaster } from '../../product-master/product-master.response';
import { IUom } from '../../uom/uom.response';
import { IGstHsnCode } from '../../gst-hsn-code/gst-hsn-code.response';
import { IItemAttribute } from '../../item-attribute/item-attribute.response';

export type ItemTab = 'details' | 'dashboard' | 'inventory' | 'variants' | 'metal-tags' | 'stone-details' | 'accounting' | 'purchasing' | 'sales' | 'tax' | 'quality' | 'manufacturing';

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

export interface ItemBarcode {
  id: number;
  barcode: string;
  barcode_type: string;
  uom_id: number | null;
}

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
  selector: 'app-item-upsert',
  imports: [ReactiveFormsModule],
  templateUrl: './item-upsert.html',
  styleUrl: './item-upsert.scss',
})
export class ItemUpsert extends Base implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  isEditMode = signal<boolean>(false);
  isLoading = signal<boolean>(false);
  isSaving = signal<boolean>(false);
  errorMessage = signal<string | null>(null);
  activeTab = signal<ItemTab>('details');
  itemId = signal<number>(0);

  itemGroups = signal<IGroupItem[]>([]);
  productMasters = signal<IProductMaster[]>([]);
  uoms = signal<IUom[]>([]);
  hsnCodes = signal<IGstHsnCode[]>([]);
  
  barcodes = signal<ItemBarcode[]>([]);
  editingBarcodeId = signal<number | null>(null);

  itemAttributes = signal<IItemAttribute[]>([]);
  variantAttributes = signal<ItemVariantAttribute[]>([]);
  editingVariantId = signal<number | null>(null);

  variantModalOpen = signal<boolean>(false);
  variantModalIsNew = signal<boolean>(false);
  variantModalId = signal<number>(0);
  variantModalDraft = signal<ItemVariantAttribute>({
    id: 0, attribute_id: null, attribute_value_id: null, attribute_value_ids: [],
    variant_of: '', attribute_value_label: '', is_disabled: false, stone_id: '', stone_family: '',
  });

  variantWeightForm = new FormGroup<ItemVariantWeightForm>({
    gross_weight: new FormControl<number>(0, { nonNullable: true, validators: [Validators.required, Validators.min(0)] }),
    net_weight: new FormControl<number>(0, { nonNullable: true, validators: [Validators.min(0)] }),
    stones_weight: new FormControl<number>(0, { nonNullable: true, validators: [Validators.min(0)] }),
    stone_carat_wt: new FormControl<number>(0, { nonNullable: true, validators: [Validators.min(0)] }),
    pure_weight_metal: new FormControl<number>(0, { nonNullable: true, validators: [Validators.min(0)] }),
    labor_rate: new FormControl<number>(0, { nonNullable: true, validators: [Validators.min(0)] }),
    labor_per_gram: new FormControl<string>('', { nonNullable: true }),
    stones: new FormControl<string>('', { nonNullable: true }),
  });

  readonly tabs: { key: ItemTab; label: string }[] = [
    { key: 'details', label: 'Details' },
    { key: 'dashboard', label: 'Dashboard' },
    { key: 'inventory', label: 'Inventory' },
    { key: 'variants', label: 'Variants' },
    { key: 'metal-tags', label: 'Metal Tags' },
    { key: 'stone-details', label: 'Stone Details' },
    { key: 'accounting', label: 'Accounting' },
    { key: 'purchasing', label: 'Purchasing' },
    { key: 'sales', label: 'Sales' },
    { key: 'tax', label: 'Tax' },
    { key: 'quality', label: 'Quality' },
    { key: 'manufacturing', label: 'Manufacturing' },
  ];

  inventoryForm = new FormGroup<ItemInventoryForm>({
    shelf_life_in_days: new FormControl<number>(0, { nonNullable: true, validators: [Validators.min(0)] }),
    end_of_life: new FormControl<string>('', { nonNullable: true }),
    default_material_request_type: new FormControl<string>('Purchase', { nonNullable: true }),
    valuation_method: new FormControl<string>('', { nonNullable: true }),
    warranty_period: new FormControl<number>(0, { nonNullable: true, validators: [Validators.min(0)] }),
    weight_per_unit: new FormControl<number>(0, { nonNullable: true, validators: [Validators.min(0)] }),
    weight_uom_id: new FormControl<number | null>(null),
    allow_negative_stock: new FormControl<boolean>(false, { nonNullable: true }),
  });

  detailsForm = new FormGroup<ItemDetailsForm>({
    product_master_id: new FormControl<number | null>(null),
    item_name: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(2)],
    }),
    item_group_id: new FormControl<number | null>(null, { validators: [Validators.required] }),
    hsn_sac: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
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

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam && idParam !== 'new') {
      this.itemId.set(+idParam);
      this.isEditMode.set(true);
      this.loadItem();
    }
    this.loadDropdowns();
  }

  setTab(tab: ItemTab): void {
    this.activeTab.set(tab);
  }

  addBarcode(): void {
    const newBarcode: ItemBarcode = {
      id: Date.now(),
      barcode: '',
      barcode_type: '',
      uom_id: null,
    };
    this.barcodes.update(b => [...b, newBarcode]);
    this.editingBarcodeId.set(newBarcode.id);
  }

  editBarcode(id: number): void {
    this.editingBarcodeId.set(id);
  }

  deleteBarcode(id: number): void {
    this.barcodes.update(b => b.filter(bc => bc.id !== id));
  }

  updateBarcodeField(id: number, field: keyof ItemBarcode, value: any): void {
    this.barcodes.update(bcs =>
      bcs.map(bc => bc.id === id ? { ...bc, [field]: value } : bc)
    );
  }

  cancelBarcodeEdit(): void {
    this.editingBarcodeId.set(null);
  }

  addVariantAttribute(): void {
    const draft: ItemVariantAttribute = {
      id: Date.now(), attribute_id: null, attribute_value_id: null, attribute_value_ids: [],
      variant_of: '', attribute_value_label: '', is_disabled: false, stone_id: '', stone_family: '',
    };
    this.variantModalDraft.set({ ...draft });
    this.variantModalId.set(draft.id);
    this.variantModalIsNew.set(true);
    this.variantModalOpen.set(true);
  }

  openVariantModal(id: number): void {
    const row = this.variantAttributes().find(r => r.id === id);
    if (!row) return;
    this.variantModalDraft.set({ ...row });
    this.variantModalId.set(id);
    this.variantModalIsNew.set(false);
    this.variantModalOpen.set(true);
  }

  closeVariantModal(): void {
    this.variantModalOpen.set(false);
  }

  confirmVariantModal(): void {
    const draft = this.variantModalDraft();
    if (this.variantModalIsNew()) {
      this.variantAttributes.update(v => [...v, { ...draft }]);
    } else {
      this.variantAttributes.update(rows =>
        rows.map(r => r.id === draft.id ? { ...draft } : r)
      );
    }
    this.variantModalOpen.set(false);
  }

  updateModalDraft(field: keyof ItemVariantAttribute, value: any): void {
    this.variantModalDraft.update(d => ({ ...d, [field]: value }));
  }

  editVariantRow(id: number): void {
    this.openVariantModal(id);
  }

  deleteVariantRow(id: number): void {
    this.variantAttributes.update(v => v.filter(r => r.id !== id));
  }

  updateVariantAttribute(id: number, attributeId: number | null): void {
    this.variantAttributes.update(rows =>
      rows.map(r => r.id === id ? { ...r, attribute_id: attributeId, attribute_value_ids: [] } : r)
    );
  }

  getVariantRowIndex(): number {
    return this.variantAttributes().findIndex(r => r.id === this.variantModalId());
  }

  getAttributeValues(attributeId: number | null) {
    if (!attributeId) return [];
    return this.itemAttributes().find(a => a.id === attributeId)?.values ?? [];
  }

  getAttributeName(attributeId: number | null): string {
    if (!attributeId) return '—';
    return this.itemAttributes().find(a => a.id === attributeId)?.attribute_name ?? '—';
  }

  cancelVariantEdit(): void {
    this.editingVariantId.set(null);
  }

  toggleVariantValue(rowId: number, valueId: number, checked: boolean): void {
    this.variantAttributes.update(rows =>
      rows.map(r => {
        if (r.id !== rowId) return r;
        const ids = checked
          ? [...r.attribute_value_ids, valueId]
          : r.attribute_value_ids.filter(id => id !== valueId);
        return { ...r, attribute_value_ids: ids };
      })
    );
  }

  getSelectedValueNames(row: ItemVariantAttribute): string {
    const values = this.getAttributeValues(row.attribute_id);
    return row.attribute_value_ids
      .map(id => values.find(v => v.id === id)?.attribute_value ?? '')
      .filter(Boolean)
      .join(', ');
  }

  private async loadDropdowns(): Promise<void> {
    try {
      const [groups, products, uoms, hsn, attrs] = await Promise.all([
        this.httpGetPromise<IGenericResponse<IGroupItem[]>>(this.apiRoutes.item_group.GET_ALL),
        this.httpGetPromise<IGenericResponse<IProductMaster[]>>(this.apiRoutes.product_master.GET_ALL),
        this.httpGetPromise<IGenericResponse<IUom[]>>(this.apiRoutes.uom.GET_ALL),
        this.httpGetPromise<IGenericResponse<IGstHsnCode[]>>(this.apiRoutes.gst_hsn_code.GET_ALL),
        this.httpGetPromise<IGenericResponse<IItemAttribute[]>>(this.apiRoutes.item_attribute.GET_ALL),
      ]);
      if (groups.status) this.itemGroups.set(groups.data);
      if (products.status) this.productMasters.set(products.data);
      if (uoms.status) this.uoms.set(uoms.data);
      if (hsn.status) this.hsnCodes.set(hsn.data);
      if (attrs.status) this.itemAttributes.set(attrs.data);
    } catch {
      // non-critical, dropdowns may be empty
    }
  }

  private async loadItem(): Promise<void> {
    this.isLoading.set(true);
    this.errorMessage.set(null);
    try {
      const response = await this.httpGetPromise<IGenericResponse<IItem>>(
        this.apiRoutes.item.GET_BY_ID(this.itemId())
      );
      if (response.status) {
        this.detailsForm.patchValue({
            ...response.data,
            description: response.data.description ?? '',
          });
      } else {
        this.errorMessage.set(response.message);
      }
    } catch {
      this.errorMessage.set('Failed to load item. Please try again.');
    } finally {
      this.isLoading.set(false);
    }
  }

  async onSave(): Promise<void> {
    if (this.detailsForm.invalid) {
      this.detailsForm.markAllAsTouched();
      this.setTab('details');
      return;
    }
    this.isSaving.set(true);
    this.errorMessage.set(null);
    try {
      const payload = this.detailsForm.getRawValue();
      if (this.isEditMode()) {
        await this.httpPutPromise<IGenericResponse<IItem>, typeof payload>(
          this.apiRoutes.item.UPDATE(this.itemId()), payload
        );
      } else {
        await this.httpPostPromise<IGenericResponse<IItem>, typeof payload>(
          this.apiRoutes.item.CREATE, payload
        );
      }
      this.toastr.success('Item saved successfully.');
      this.router.navigate([this.appRoutes.ITEM]);
    } catch {
      this.errorMessage.set('Failed to save item. Please try again.');
    } finally {
      this.isSaving.set(false);
    }
  }

  onCancel(): void {
    this.router.navigate([this.appRoutes.ITEM]);
  }

  get f() { return this.detailsForm.controls; }
  get invF() { return this.inventoryForm.controls; }

  getUomName(id: number): string {
    return this.uoms().find(u => u.id === id)?.name ?? '—';
  }
}
