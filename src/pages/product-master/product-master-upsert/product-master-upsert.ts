import { Component, OnInit, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Base } from '../../../core/base/base';
import { IGenericResponse } from '../../../core/response/genericResponse.interface';
import { IComboItem, IComboItemFrappeBased } from '../../../core/response/combo.interface';
import { IProductMaster } from '../product-master.response';
import { BreadcrumbService } from '../../../core/services/breadcrumb.service';
import { APPRoutes } from '../../../core/constant/app-routes';

export interface ProductMasterForm {
  item_group_name: FormControl<string | null>;
  sub_category_id: FormControl<number | null>;
  name: FormControl<string>;
  product_description: FormControl<string>;
  is_active: FormControl<boolean>;
}

@Component({
  selector: 'app-product-master-upsert',
  imports: [ReactiveFormsModule],
  templateUrl: './product-master-upsert.html',
  styleUrl: './product-master-upsert.scss',
})
export class ProductMasterUpsert extends Base implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private breadcrumb = inject(BreadcrumbService);

  isEditMode = signal<boolean>(false);
  isLoading = signal<boolean>(false);
  isSaving = signal<boolean>(false);
  errorMessage = signal<string | null>(null);
  itemName = signal<string>('');
  activeTab = signal<'details' | 'metal' | 'rule_set_mapping' | 'product_description'>('details');

  // Category (Group Item) related
  itemGroups = signal<IComboItemFrappeBased[]>([]);

  // Sub Category related
  subCategories = signal<IComboItem[]>([]);

  form = new FormGroup<ProductMasterForm>({
    item_group_name: new FormControl<string | null>(null),
    sub_category_id: new FormControl<number | null>(
      { value: null, disabled: true },
      { validators: [Validators.required] },
    ),
    name: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(2)],
    }),
    product_description: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.maxLength(400)],
    }),
    is_active: new FormControl<boolean>(true, { nonNullable: true }),
  });

  override ngOnInit(): void {
    super.ngOnInit();
    const nameParam = this.route.snapshot.queryParamMap.get('name');
    if (nameParam && +nameParam !== 0) {
      this.itemName.set(nameParam);
      this.isEditMode.set(true);
      this.breadcrumb.set([
        { label: 'Product Master', url: APPRoutes.PRODUCT_MASTER },
        { label: 'Edit Product Master' },
      ]);
      this.setHeaderConfig('Edit Product Master', 'Update');
      this.loadItemGroups().then(() => this.loadItem());
    } else {
      this.breadcrumb.set([
        { label: 'Product Master', url: APPRoutes.PRODUCT_MASTER },
        { label: 'Add Product Master' },
      ]);
      this.setHeaderConfig('New Product Master', 'Save');
      this.loadItemGroups();
    }
  }

  public override onActionButtonClick(): void {
    this.onSubmit();
  }

  private async loadItemGroups(): Promise<void> {
    try {
      const response = await this.httpGetPromise<IGenericResponse<IComboItemFrappeBased[]>>(
        this.apiRoutes.item_group.COMBO,
      );
      if (response.status) this.itemGroups.set(response.data);
    } catch {
      // non-blocking
    }
  }

  private async loadSubCategoriesByItemGrpName(item_group_name: string | null): Promise<void> {
    try {
      const response = await this.httpGetPromise<IGenericResponse<IComboItem[]>>(
        this.apiRoutes.sub_category.COMBO(item_group_name),
      );
      if (response.status) this.subCategories.set(response.data);
    } catch {
      // non-blocking
    }
  }

  onCategoryChange(): void {
    this.form.controls.sub_category_id.setValue(null);
    console.log(this.form.controls.item_group_name.value);

    const item_group_id: string | null = this.form.controls.item_group_name.value ?? null;

    this.subCategories.set([]);
    if (item_group_id) {
      this.form.controls.sub_category_id.enable();
      this.loadSubCategoriesByItemGrpName(item_group_id);
    } else {
      this.form.controls.sub_category_id.disable();
    }
  }

  private async loadItem(): Promise<void> {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    try {
      const url = this.apiRoutes.product_master.GET_BY_NAME(this.itemName());
      const response: IGenericResponse<IProductMaster> =
        await this.httpGetPromise<IGenericResponse<IProductMaster>>(url);

      if (response.status) {
        await this.loadSubCategoriesByItemGrpName(response.data.sub_category.item_group_id ?? '');
        this.form.controls.sub_category_id.enable();

        this.form.patchValue({
          item_group_name: response.data.sub_category.item_group_id,
          sub_category_id: response.data.sub_category.id,
          name: response.data.name,
          product_description: response.data.product_description,
          is_active: response.data.is_active,
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

  async onSubmit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSaving.set(true);
    this.errorMessage.set(null);

    try {
      const { item_group_name: item_group_id, ...payload } = this.form.getRawValue();

      if (this.isEditMode()) {
        await this.httpPatchPromise<IGenericResponse<IProductMaster>, typeof payload>(
          this.apiRoutes.product_master.UPDATE(this.itemName()),
          payload,
        );
      } else {
        await this.httpPostPromise<IGenericResponse<IProductMaster>, typeof payload>(
          this.apiRoutes.product_master.CREATE,
          payload,
        );
      }

      this.toastr.success('Product Master saved successfully.');
      this.router.navigate([APPRoutes.PRODUCT_MASTER]);
    } catch {
      this.errorMessage.set('Failed to save. Please try again.');
    } finally {
      this.isSaving.set(false);
    }
  }

  onCancel(): void {
    this.router.navigate([APPRoutes.PRODUCT_MASTER]);
  }

  get subCategoryIdControl() {
    return this.form.controls.sub_category_id;
  }
  get nameControl() {
    return this.form.controls.name;
  }
  get productDescriptionControl() {
    return this.form.controls.product_description;
  }
}
