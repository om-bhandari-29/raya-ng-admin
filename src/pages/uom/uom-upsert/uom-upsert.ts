import { Component, OnInit, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Base } from '../../../core/base/base';
import { IGenericResponse } from '../../../core/response/genericResponse.interface';
import { IUom } from '../uom.response';
import { HttpErrorResponse } from '@angular/common/http';

export interface UomDialogData {
  /** empty string for create, name string for edit */
  itemName: string;
}

export interface UomForm {
  name: FormControl<string>;
  must_be_whole_number: FormControl<boolean>;
  enabled: FormControl<boolean>;
  is_active: FormControl<boolean>;
}

@Component({
  selector: 'app-uom-upsert',
  imports: [ReactiveFormsModule],
  templateUrl: './uom-upsert.html',
  styleUrl: './uom-upsert.scss',
})
export class UomUpsert extends Base implements OnInit {
  private dialogRef = inject(MatDialogRef<UomUpsert>);
  private dialogData = inject<UomDialogData>(MAT_DIALOG_DATA);

  isEditMode = signal<boolean>(false);
  isLoading = signal<boolean>(false);
  isSaving = signal<boolean>(false);
  errorMessage = signal<string | null>(null);

  form = new FormGroup<UomForm>({
    name: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(50)],
    }),
    must_be_whole_number: new FormControl<boolean>(false, { nonNullable: true }),
    enabled: new FormControl<boolean>(true, { nonNullable: true }),
    is_active: new FormControl<boolean>(true, { nonNullable: true }),
  });

  override ngOnInit(): void {
    super.ngOnInit();
    if (this.dialogData.itemName !== '') {
      this.isEditMode.set(true);
      this.loadItem();
    }
  }

  private async loadItem(): Promise<void> {
    this.isLoading.set(true);
    this.errorMessage.set(null);
    try {
      const url = this.apiRoutes.uom.GET_BY_ID(this.dialogData.itemName);
      const response = await this.httpGetPromise<IGenericResponse<IUom>>(url);
      if (response.status) {
        this.form.patchValue({
          name: response.data.name,
          must_be_whole_number: response.data.must_be_whole_number ?? false,
          enabled: response.data.enabled ?? true,
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
        const url = this.apiRoutes.uom.UPDATE(this.dialogData.itemName);
        await this.httpPatchPromise<IGenericResponse<IUom>, typeof payload>(url, payload);
      } else {
        await this.httpPostPromise<IGenericResponse<IUom>, typeof payload>(
          this.apiRoutes.uom.CREATE,
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

  get nameControl() {
    return this.form.controls.name;
  }
}
