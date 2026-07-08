import { Component, OnInit, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Base } from '../../../core/base/base';
import { IGenericResponse } from '../../../core/response/genericResponse.interface';
import { RMetal, RMetalPurity } from '../../../core/response/metal-purity.response';
import { HttpErrorResponse } from '@angular/common/http';
import { MetalMasterType } from '../../../core/enum/metal-master.enum';
import {
  initializeForm,
  MetalPurityDialogData,
  MetalPurityForm,
} from './metal-master-upsert.model';

@Component({
  selector: 'app-metal-purity-upsert',
  imports: [ReactiveFormsModule],
  templateUrl: './metal-purity-upsert.html',
  styleUrl: './metal-purity-upsert.scss',
})
export class MetalPurityUpsert extends Base implements OnInit {
  private dialogRef = inject(MatDialogRef<MetalPurityUpsert>);
  public dialogData = inject<MetalPurityDialogData>(MAT_DIALOG_DATA);
  public readonly MetalMasterType = MetalMasterType;

  public modalTitle = signal<string>('');

  isEditMode = signal<boolean>(false);
  isLoading = signal<boolean>(false);
  isSaving = signal<boolean>(false);
  errorMessage = signal<string | null>(null);

  public form: FormGroup<MetalPurityForm> = initializeForm();

  override ngOnInit(): void {
    super.ngOnInit();
    if (this.dialogData.itemId !== 0) {
      this.isEditMode.set(true);
      this.loadItem();
    }

    this.setTitle();
    this.updateFormValidation();
  }

  private async loadItem(): Promise<void> {
    if (this.dialogData.metalMasterType === MetalMasterType.METAL) {
      this.loadMetalItem();
    } else {
      this.loadPurityItem();
    }
  }

  private loadMetalItem(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.httpGetPromise<IGenericResponse<RMetal>>(
      this.apiRoutes.Metal_Master.GET_BY_ID(this.dialogData.itemId),
    )
      .then((response) => {
        if (response.status) {
          this.form.patchValue({
            name: response.data.name,
          });
        } else {
          this.errorMessage.set(response.message);
        }
      })
      .catch(() => {
        this.errorMessage.set('Failed to load metal item. Please try again.');
      })
      .finally(() => {
        this.isLoading.set(false);
      });
  }

  private loadPurityItem(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.httpGetPromise<IGenericResponse<RMetalPurity>>(
      this.apiRoutes.Metal_Purity.GET_BY_ID(this.dialogData.itemId),
    )
      .then((response) => {
        if (response.status) {
          this.form.patchValue({
            name: response.data.name,
            purity: response.data.purity,
            percentage: Number(response.data.percentage),
            rate_per_gram_inr: Number(response.data.rate_per_gram_inr),
            rate_per_gram_usd: Number(response.data.rate_per_gram_usd),
          });
        } else {
          this.errorMessage.set(response.message);
        }
      })
      .catch(() => {
        this.errorMessage.set('Failed to load purity item. Please try again.');
      })
      .finally(() => {
        this.isLoading.set(false);
      });
  }

  public onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSaving.set(true);
    this.errorMessage.set(null);
    if (this.dialogData.metalMasterType === MetalMasterType.METAL) {
      this.saveMetalMaster();
    } else {
      this.saveMetalPurity();
    }
  }

  private saveMetalMaster(): void {
    this.isSaving.set(true);
    this.errorMessage.set(''); // Clear previous errors

    const payload = {
      name: this.form.controls.name.value,
    };

    (this.dialogData.itemId
      ? this.httpPatchObservable<IGenericResponse<RMetal>, typeof payload>(
          this.apiRoutes.Metal_Master.UPDATE(this.dialogData.itemId),
          payload,
        )
      : this.httpPostObservable<IGenericResponse<RMetal>, typeof payload>(
          this.apiRoutes.Metal_Master.CREATE,
          payload,
        )
    ).subscribe({
      next: (response: IGenericResponse<RMetal>) => {
        if (response.status) {
          this.toastr.success(response.message);
          this.dialogRef.close(true);
        } else {
          this.errorMessage.set(response.message);
          this.isSaving.set(false);
        }
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage.set(error.error?.message || error.message || 'An error occurred');
        this.isSaving.set(false);
      },
    });
  }

  private saveMetalPurity(): void {
    const formdata = this.form.getRawValue();

    const payload = {
      purity: formdata.purity,
      name: formdata.name,
      metal_id: this.dialogData.metalMasterId,
      percentage: formdata.percentage,
      rate_per_gram_inr: formdata.rate_per_gram_inr,
      rate_per_gram_usd: formdata.rate_per_gram_usd,
    };

    (this.dialogData.itemId
      ? this.httpPatchObservable<IGenericResponse<RMetalPurity>, typeof payload>(
          this.apiRoutes.Metal_Purity.UPDATE(this.dialogData.itemId),
          payload,
        )
      : this.httpPostObservable<IGenericResponse<RMetalPurity>, typeof payload>(
          this.apiRoutes.Metal_Purity.CREATE,
          payload,
        )
    ).subscribe({
      next: (response: IGenericResponse<RMetalPurity>) => {
        if (response.status) {
          this.toastr.success(response.message);
          this.dialogRef.close(true);
        } else {
          this.errorMessage.set(response.message);
          this.isSaving.set(false);
        }
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage.set(error.error.message);
        this.isSaving.set(false);
      },
    });
  }

  private updateFormValidation(): void {
    this.form.controls.name.setValidators([Validators.required, Validators.minLength(2)]);
    this.form.controls.name.updateValueAndValidity();
    if (this.dialogData.metalMasterType === MetalMasterType.PURITY) {
      this.form.controls.purity.setValidators([Validators.required]);
      this.form.controls.percentage.setValidators([
        Validators.required,
        Validators.min(0),
        Validators.max(100),
      ]);
      this.form.controls.rate_per_gram_inr.setValidators([Validators.required, Validators.min(0)]);
      this.form.controls.rate_per_gram_usd.setValidators([Validators.required, Validators.min(0)]);

      this.form.controls.purity.updateValueAndValidity();
      this.form.controls.percentage.updateValueAndValidity();
      this.form.controls.rate_per_gram_inr.updateValueAndValidity();
      this.form.controls.rate_per_gram_usd.updateValueAndValidity();
    }
  }

  private setTitle(): void {
    this.modalTitle.set(
      this.isEditMode()
        ? this.dialogData.metalMasterType === MetalMasterType.METAL
          ? 'Edit Metal Purity'
          : 'Edit Metal Color'
        : this.dialogData.metalMasterType === MetalMasterType.METAL
          ? 'Add Metal Purity'
          : 'Add Metal Color',
    );
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
