import { Component, OnInit, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Base } from '../../../core/base/base';
import { IGenericResponse } from '../../../core/response/genericResponse.interface';
import { RMetalPurity } from '../../../core/response/metal-purity.response';
import { HttpErrorResponse } from '@angular/common/http';
import { MetalMasterType } from '../../../core/enum/metal-master.enum';

export interface MetalPurityDialogData {
  /** 0 for create, positive id for edit */
  itemId: number;
  metalMasterType: MetalMasterType;
}

export interface MetalPurityForm {
  name: FormControl<string>;
  code: FormControl<string>;
}

@Component({
  selector: 'app-metal-purity-upsert',
  imports: [ReactiveFormsModule],
  templateUrl: './metal-purity-upsert.html',
  styleUrl: './metal-purity-upsert.scss',
})
export class MetalPurityUpsert extends Base implements OnInit {
  private dialogRef = inject(MatDialogRef<MetalPurityUpsert>);
  public dialogData = inject<MetalPurityDialogData>(MAT_DIALOG_DATA);

  public modalTitle = signal<string>('');

  isEditMode = signal<boolean>(false);
  isLoading = signal<boolean>(false);
  isSaving = signal<boolean>(false);
  errorMessage = signal<string | null>(null);

  form = new FormGroup<MetalPurityForm>({
    name: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(2)],
    }),
    code: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(1)],
    }),
  });

  override ngOnInit(): void {
    super.ngOnInit();
    if (this.dialogData.itemId !== 0) {
      this.isEditMode.set(true);
      this.loadItem();
    }

    this.modalTitle.set(this.isEditMode() ? (this.dialogData.metalMasterType === MetalMasterType.PURITY ? 'Edit Metal Purity' : 'Edit Metal Color') : (this.dialogData.metalMasterType === MetalMasterType.PURITY ? 'Add Metal Purity' : 'Add Metal Color'));
  }

  private async loadItem(): Promise<void> {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    try {
      // const url = this.apiRoutes.Metal_Purity.GET_BY_ID(this.dialogData.itemId);
      const url = this.dialogData.metalMasterType === MetalMasterType.PURITY
        ? this.apiRoutes.Metal_Purity.GET_BY_ID(this.dialogData.itemId)
        : this.apiRoutes.Metal_Color.GET_BY_ID(this.dialogData.itemId);
      const response = await this.httpGetPromise<IGenericResponse<RMetalPurity>>(url);

      if (response.status) {
        this.form.patchValue({
          name: response.data.name,
          code: response.data.code,
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
        const url = this.dialogData.metalMasterType === MetalMasterType.PURITY
          ? this.apiRoutes.Metal_Purity.UPDATE(this.dialogData.itemId)
          : this.apiRoutes.Metal_Color.UPDATE(this.dialogData.itemId);
        await this.httpPatchPromise<IGenericResponse<RMetalPurity>, typeof payload>(url, payload);
      } else {
        await this.httpPostPromise<IGenericResponse<RMetalPurity>, typeof payload>(
          this.dialogData.metalMasterType === MetalMasterType.PURITY
            ? this.apiRoutes.Metal_Purity.CREATE
            : this.apiRoutes.Metal_Color.CREATE,
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

  get codeControl() {
    return this.form.controls.code;
  }
}
