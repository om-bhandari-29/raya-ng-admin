import { Component, OnInit, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Base } from '../../../core/base/base';
import { IGenericResponse } from '../../../core/response/genericResponse.interface';
import { IComboItem, IComboItemFrappeBased } from '../../../core/response/combo.interface';
import { ISubCategory } from '../sub-category.response';
import { HttpErrorResponse } from '@angular/common/http';

export interface SubCategoryDialogData {
  /** 0 for create, positive id for edit */
  itemId: number;
}

export interface SubCategoryForm {
  item_group_name: FormControl<number | null>;
  name: FormControl<string>;
  is_active: FormControl<boolean>;
}

@Component({
  selector: 'app-sub-category-upsert',
  imports: [ReactiveFormsModule],
  templateUrl: './sub-category-upsert.html',
  styleUrl: './sub-category-upsert.scss',
})
export class SubCategoryUpsert extends Base implements OnInit {
  private dialogRef = inject(MatDialogRef<SubCategoryUpsert>);
  private dialogData = inject<SubCategoryDialogData>(MAT_DIALOG_DATA);

  isEditMode = signal<boolean>(false);
  isLoading = signal<boolean>(false);
  isSaving = signal<boolean>(false);
  errorMessage = signal<string | null>(null);
  itemGroups = signal<IComboItemFrappeBased[]>([]);

  form = new FormGroup<SubCategoryForm>({
    item_group_name: new FormControl<number | null>(null, { validators: [Validators.required] }),
    name: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(2)],
    }),
    is_active: new FormControl<boolean>(true, { nonNullable: true }),
  });

  override ngOnInit(): void {
    super.ngOnInit();
    this.loadItemGroups();
    if (this.dialogData.itemId !== 0) {
      this.isEditMode.set(true);
      this.loadItem();
    }
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

  private async loadItem(): Promise<void> {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    try {
      const url = this.apiRoutes.sub_category.GET_BY_ID(this.dialogData.itemId);
      const response = await this.httpGetPromise<IGenericResponse<ISubCategory>>(url);

      if (response.status) {
        this.form.patchValue({
          item_group_name: response.data.item_group_name,
          name: response.data.name,
          is_active: response.data.is_active,
        });

        console.log(this.form.value);
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
        const url = this.apiRoutes.sub_category.UPDATE(this.dialogData.itemId);
        await this.httpPatchPromise<IGenericResponse<ISubCategory>, typeof payload>(url, payload);
      } else {
        await this.httpPostPromise<IGenericResponse<ISubCategory>, typeof payload>(
          this.apiRoutes.sub_category.CREATE,
          payload,
        );
      }

      this.dialogRef.close(true);
    } catch (err) {
      this.errorMessage.set((err as HttpErrorResponse).error.message);
    } finally {
      this.isSaving.set(false);
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  get itemGroupIdControl() {
    return this.form.controls.item_group_name;
  }
  get nameControl() {
    return this.form.controls.name;
  }
}
