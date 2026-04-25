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

  private async loadDropdowns(): Promise<void> {
    try {
      const [groups, products, uoms, hsn] = await Promise.all([
        this.httpGetPromise<IGenericResponse<IGroupItem[]>>(this.apiRoutes.item_group.GET_ALL),
        this.httpGetPromise<IGenericResponse<IProductMaster[]>>(this.apiRoutes.product_master.GET_ALL),
        this.httpGetPromise<IGenericResponse<IUom[]>>(this.apiRoutes.uom.GET_ALL),
        this.httpGetPromise<IGenericResponse<IGstHsnCode[]>>(this.apiRoutes.gst_hsn_code.GET_ALL),
      ]);
      if (groups.status) this.itemGroups.set(groups.data);
      if (products.status) this.productMasters.set(products.data);
      if (uoms.status) this.uoms.set(uoms.data);
      if (hsn.status) this.hsnCodes.set(hsn.data);
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
}
