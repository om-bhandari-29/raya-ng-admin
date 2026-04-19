import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Base } from '../../../core/base/base';
import { IGenericResponse } from '../../../core/response/genericResponse.interface';
import { IProductMaster } from '../product-master.response';
import { ISubCategory } from '../../sub-category/sub-category.response';
import { IGroupItem } from '../../group-item/group-item.response';

export interface ProductMasterDialogData {
  /** 0 for create, positive id for edit */
  itemId: number;
}

export interface ProductMasterForm {
  sub_category_id: FormControl<number | null>;
  name: FormControl<string>;
  labour_rate: FormControl<string>;
  labour_rate_on: FormControl<string>;
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
  private dialogRef = inject(MatDialogRef<ProductMasterUpsert>);
  private dialogData = inject<ProductMasterDialogData>(MAT_DIALOG_DATA);

  isEditMode = signal<boolean>(false);
  isLoading = signal<boolean>(false);
  isSaving = signal<boolean>(false);
  errorMessage = signal<string | null>(null);
  
  // Category (Group Item) related
  itemGroups = signal<IGroupItem[]>([]);
  selectedCategoryId = signal<number | null>(null);
  
  // Sub Category related
  allSubCategories = signal<ISubCategory[]>([]);
  filteredSubCategories = computed(() => {
    const categoryId = this.selectedCategoryId();
    if (!categoryId) return [];
    return this.allSubCategories().filter(sc => sc.item_group_id === categoryId);
  });

  form = new FormGroup<ProductMasterForm>({
    sub_category_id: new FormControl<number | null>(null, { validators: [Validators.required] }),
    name: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(2)],
    }),
    labour_rate: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)],
    }),
    labour_rate_on: new FormControl<string>('Net', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    product_description: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    is_active: new FormControl<boolean>(true, { nonNullable: true }),
  });

  ngOnInit(): void {
    this.loadItemGroups();
    this.loadSubCategories();
    if (this.dialogData.itemId !== 0) {
      this.isEditMode.set(true);
      this.loadItem();
    }
  }

  private async loadItemGroups(): Promise<void> {
    try {
      const response = await this.httpGetPromise<IGenericResponse<IGroupItem[]>>(
        this.apiRoutes.item_group.GET_ALL
      );
      if (response.status) this.itemGroups.set(response.data);
    } catch {
      // non-blocking
    }
  }

  private async loadSubCategories(): Promise<void> {
    try {
      const response = await this.httpGetPromise<IGenericResponse<ISubCategory[]>>(
        this.apiRoutes.sub_category.GET_ALL
      );
      if (response.status) this.allSubCategories.set(response.data);
    } catch {
      // non-blocking
    }
  }

  onCategoryChange(categoryId: number | null): void {
    this.selectedCategoryId.set(categoryId);
    // Reset sub-category when category changes
    this.form.controls.sub_category_id.setValue(null);
  }

  private async loadItem(): Promise<void> {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    try {
      const url = this.apiRoutes.product_master.GET_BY_ID(this.dialogData.itemId);
      const response = await this.httpGetPromise<IGenericResponse<IProductMaster>>(url);

      if (response.status) {
        // Set the category based on the sub_category's item_group_id
        const subCategory = this.allSubCategories().find(sc => sc.id === response.data.sub_category_id);
        if (subCategory) {
          this.selectedCategoryId.set(subCategory.item_group_id);
        }
        
        this.form.patchValue({
          sub_category_id: response.data.sub_category_id,
          name: response.data.name,
          labour_rate: response.data.labour_rate,
          labour_rate_on: response.data.labour_rate_on,
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
      const payload = this.form.getRawValue();

      if (this.isEditMode()) {
        const url = this.apiRoutes.product_master.UPDATE(this.dialogData.itemId);
        await this.httpPatchPromise<IGenericResponse<IProductMaster>, typeof payload>(url, payload);
      } else {
        await this.httpPostPromise<IGenericResponse<IProductMaster>, typeof payload>(
          this.apiRoutes.product_master.CREATE,
          payload
        );
      }

      this.dialogRef.close(true);
    } catch {
      this.errorMessage.set('Failed to save. Please try again.');
    } finally {
      this.isSaving.set(false);
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  get subCategoryIdControl() { return this.form.controls.sub_category_id; }
  get nameControl() { return this.form.controls.name; }
  get labourRateControl() { return this.form.controls.labour_rate; }
  get labourRateOnControl() { return this.form.controls.labour_rate_on; }
  get productDescriptionControl() { return this.form.controls.product_description; }
}
