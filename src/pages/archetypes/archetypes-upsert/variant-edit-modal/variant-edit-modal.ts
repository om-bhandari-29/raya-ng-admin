import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Base } from '../../../../core/base/base';
import { IGenericResponse } from '../../../../core/response/genericResponse.interface';

export interface VariantEditModalData {
  variant_id: number;
  variant_name: string;
  target_gender: string;
  design_slug: string;
}
export interface VariantEditPayload {
  variant_id: number;
  variant_name: string;
  target_gender: string;
}
export interface VariantCreatePayload {
  variant_name: string;
  target_gender: string;
  design_slug: string;
}

@Component({
  selector: 'app-variant-edit-modal',
  imports: [ReactiveFormsModule],
  templateUrl: './variant-edit-modal.html',
  styleUrl: './variant-edit-modal.scss',
})
export class VariantEditModal extends Base implements OnInit {
  private dialogRef = inject(MatDialogRef<VariantEditModal>);
  public dialogData = inject<VariantEditModalData>(MAT_DIALOG_DATA);

  public isBtnLoader: WritableSignal<boolean> = signal(false);

  form = new FormGroup({
    variant_id: new FormControl<number>(0),
    variant_name: new FormControl<string>('', [Validators.required]),
    target_gender: new FormControl<string>('', [Validators.required]),
    design_slug: new FormControl<string>(''),
  });

  override ngOnInit() {
    this.form.patchValue({
      variant_id: this.dialogData.variant_id,
      variant_name: this.dialogData.variant_name,
      target_gender: this.dialogData.target_gender,
      design_slug: this.dialogData.design_slug,
    });
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formData = this.form.getRawValue();
    if (this.form.controls.variant_id.value) {
      this.isBtnLoader.update(() => true);

      const { variant_id, variant_name, target_gender } = formData;
      const payload: VariantEditPayload = {
        variant_id: variant_id ?? 0,
        variant_name: variant_name || '',
        target_gender: target_gender || '',
      };

      this.httpPatchPromise<IGenericResponse<null>, VariantEditPayload>(this.apiRoutes.products_import.UPDATE_VARIANT_ALLOWED_METALS, payload)
        .then((res: IGenericResponse<null>) => {
          if (res.status) {
            this.dialogRef.close(this.form.value);
          } else {
            this.toastr.error(res.message);
          }
        }).finally(() => this.isBtnLoader.update(() => false));
    } else {
      this.isBtnLoader.update(() => true);

      const { design_slug, variant_name, target_gender } = formData;
      const payload: VariantCreatePayload = {
        design_slug: design_slug || '',
        variant_name: variant_name || '',
        target_gender: target_gender || '',
      };

      this.httpPostPromise<IGenericResponse<number>, VariantCreatePayload>(this.apiRoutes.products_import.UPDATE_VARIANT_ALLOWED_METALS, payload as VariantCreatePayload)
        .then((res: IGenericResponse<number>) => {
          if (res.status) {
            this.form.value.variant_id = res.data;
            this.dialogRef.close(this.form.value);
          } else {
            this.toastr.error(res.message);
          }
        }).finally(() => this.isBtnLoader.update(() => false));
    }

  }

  onCancel() {
    this.dialogRef.close();
  }
}
