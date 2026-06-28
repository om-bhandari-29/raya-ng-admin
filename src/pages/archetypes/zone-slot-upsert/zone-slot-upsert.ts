import { Component, inject, OnInit, signal } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { initializeSizeQuantityMatrixForm, SizeQuantityMatrixForm } from '../archetypes-upsert/archetypes-upsert.modal';
import { RING_SIZES, RingComponentZone } from '../../../core/enum/ring-component.enum';
import { Base } from '../../../core/base/base';
import { IGenericResponse } from '../../../core/response/genericResponse.interface';
import { IZoneSlot } from '../archetypes.response';
import { HttpErrorResponse } from '@angular/common/http';

export interface ZoneSlotUpsertData {
  zone_slot_id: number;
  shape_normalized: string;
  dim_l_mm: number;
  dim_w_mm: number;
  is_dynamic_by_size: boolean;
  size_wt_matrix: Array<{ ring_size: string; stone_quantity: number }>;
  zone_type: string;
  fixed_quantity: number | null;
  variant_id: number | null;
}

@Component({
  selector: 'app-zone-slot-upsert',
  imports: [ReactiveFormsModule],
  templateUrl: './zone-slot-upsert.html',
  styleUrl: './zone-slot-upsert.scss',
})
export class ZoneSlotUpsert extends Base implements OnInit {
  private dialogRef = inject(MatDialogRef<ZoneSlotUpsert>);
  public dialogData = inject<ZoneSlotUpsertData>(MAT_DIALOG_DATA);

  public isBtnLoader = signal<boolean>(false);

  form = new FormGroup({
    zone_slot_id: new FormControl<number>(0),
    shape_normalized: new FormControl<string>('', [Validators.required]),
    dim_l_mm: new FormControl<number | null>(null, [Validators.required, Validators.min(0)]),
    dim_w_mm: new FormControl<number | null>(null, [Validators.required, Validators.min(0)]),
    is_dynamic_by_size: new FormControl<boolean>(false),
    size_wt_matrix: new FormArray<FormGroup<SizeQuantityMatrixForm>>([]),
    fixed_quantity: new FormControl<number | null>(null, [Validators.min(0)]),
    variant_id: new FormControl<number | null>(null),
    zone: new FormControl<string | null>(null)
  });

  override ngOnInit() {
    const isDynamic = this.dialogData.zone_type !== RingComponentZone.CENTER;

    this.form.patchValue({
      zone_slot_id: this.dialogData.zone_slot_id,
      shape_normalized: this.dialogData.shape_normalized,
      dim_l_mm: this.dialogData.dim_l_mm,
      dim_w_mm: this.dialogData.dim_w_mm,
      is_dynamic_by_size: isDynamic,
      fixed_quantity: this.dialogData.fixed_quantity,
      variant_id: this.dialogData.variant_id,
      zone: this.dialogData.zone_type
    });

    const fixedQtyControl = this.form.controls.fixed_quantity;
    if (!isDynamic) {
      fixedQtyControl.setValidators([Validators.required, Validators.min(1)]);
    } else {
      fixedQtyControl.clearValidators();
    }
    fixedQtyControl.updateValueAndValidity();

    const matrixArray = this.form.get('size_wt_matrix') as FormArray;

    if (isDynamic) {
      if (this.dialogData.size_wt_matrix && this.dialogData.size_wt_matrix.length > 0) {
        this.dialogData.size_wt_matrix.forEach((item) => {
          matrixArray.push(initializeSizeQuantityMatrixForm(item));
        });
      } else {
        RING_SIZES.forEach((size) => {
          matrixArray.push(initializeSizeQuantityMatrixForm({
            ring_size: String(size),
            stone_quantity: 0
          }));
        });
      }
    }
  }

  public getSizeWtMatrixArray(): FormArray {
    return this.form.get('size_wt_matrix') as FormArray;
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (this.form.value.zone_slot_id) {
      this.isBtnLoader.set(true);
      const payload = {
        zone_slot_id: this.form.value.zone_slot_id,
        shape_normalized: this.form.value.shape_normalized,
        dim_l_mm: this.form.value.dim_l_mm,
        dim_w_mm: this.form.value.dim_w_mm,
        is_dynamic_by_size: this.form.value.is_dynamic_by_size,
        size_wt_matrix: this.form.value.size_wt_matrix,
        fixed_quantity: this.form.value.fixed_quantity,
      };

      this.httpPutPromise<IGenericResponse<null>, any>(this.apiRoutes.Blueprint_Zone_Config.UPDATE, payload)
        .then((res) => {
          if (res.status) {
            this.dialogRef.close(this.form.value);
            this.toastr.success(res.message);
          }
          else {
            this.toastr.error(res.message);
          }
        })
        .catch((err: HttpErrorResponse) => {
          this.toastr.error(err.message);
        })
        .finally(() => {
          this.isBtnLoader.set(false);
        });
    }
    else {
      const payload = {
        variant_id: this.form.value.variant_id,
        zone: this.form.value.zone,
        shape_normalized: this.form.value.shape_normalized,
        dim_l_mm: this.form.value.dim_l_mm,
        dim_w_mm: this.form.value.dim_w_mm,
        is_dynamic_by_size: this.form.value.is_dynamic_by_size,
        size_wt_matrix: this.form.value.size_wt_matrix,
        fixed_quantity: this.form.value.fixed_quantity
      };

      this.httpPostPromise<IGenericResponse<number>, any>(this.apiRoutes.Blueprint_Zone_Config.UPDATE, payload)
        .then((res) => {
          if (res.status) {
            this.form.value.zone_slot_id = res.data;
            this.dialogRef.close(this.form.value);
            this.toastr.success(res.message);
          }
          else {
            this.toastr.error(res.message);
          }
        })
        .catch((err: HttpErrorResponse) => {
          this.toastr.error(err.error.message);
        })
        .finally(() => {
          this.isBtnLoader.set(false);
        });
    }

  }

  onCancel() {
    this.dialogRef.close();
  }
}
