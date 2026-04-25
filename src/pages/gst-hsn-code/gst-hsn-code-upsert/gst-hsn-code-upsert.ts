import { Component, OnInit, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Base } from '../../../core/base/base';
import { IGenericResponse } from '../../../core/response/genericResponse.interface';
import { IGstHsnCode } from '../gst-hsn-code.response';

export interface GstHsnCodeDialogData {
  /** 0 for create, positive id for edit */
  itemId: number;
}

export interface GstHsnCodeForm {
  hsn_code: FormControl<string>;
  description: FormControl<string>;
  gst_rate: FormControl<number>;
  is_active: FormControl<boolean>;
}

@Component({
  selector: 'app-gst-hsn-code-upsert',
  imports: [ReactiveFormsModule],
  templateUrl: './gst-hsn-code-upsert.html',
  styleUrl: './gst-hsn-code-upsert.scss',
})
export class GstHsnCodeUpsert extends Base implements OnInit {
  private dialogRef = inject(MatDialogRef<GstHsnCodeUpsert>);
  private dialogData = inject<GstHsnCodeDialogData>(MAT_DIALOG_DATA);

  isEditMode = signal<boolean>(false);
  isLoading = signal<boolean>(false);
  isSaving = signal<boolean>(false);
  errorMessage = signal<string | null>(null);

  form = new FormGroup<GstHsnCodeForm>({
    hsn_code: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    description: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    gst_rate: new FormControl<number>(0, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(0), Validators.max(100)],
    }),
    is_active: new FormControl<boolean>(true, { nonNullable: true }),
  });

  ngOnInit(): void {
    if (this.dialogData.itemId !== 0) {
      this.isEditMode.set(true);
      this.loadItem();
    }
  }

  private async loadItem(): Promise<void> {
    this.isLoading.set(true);
    this.errorMessage.set(null);
    try {
      const url = this.apiRoutes.gst_hsn_code.GET_BY_ID(this.dialogData.itemId);
      const response = await this.httpGetPromise<IGenericResponse<IGstHsnCode>>(url);
      if (response.status) {
        this.form.patchValue({
          hsn_code: response.data.hsn_code,
          description: response.data.description,
          gst_rate: Number(response.data.gst_rate),
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
        const url = this.apiRoutes.gst_hsn_code.UPDATE(this.dialogData.itemId);
        await this.httpPatchPromise<IGenericResponse<IGstHsnCode>, typeof payload>(url, payload);
      } else {
        await this.httpPostPromise<IGenericResponse<IGstHsnCode>, typeof payload>(
          this.apiRoutes.gst_hsn_code.CREATE,
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

  get hsnCodeControl() { return this.form.controls.hsn_code; }
  get descriptionControl() { return this.form.controls.description; }
  get gstRateControl() { return this.form.controls.gst_rate; }
}
