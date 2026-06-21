import { Component, inject, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { initializeSizeQuantityMatrixForm, SizeQuantityMatrixForm } from '../archetypes-upsert/archetypes-upsert.modal';
import { RING_SIZES } from '../../../core/enum/ring-component.enum';
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

  form = new FormGroup({
    zone_slot_id: new FormControl<number>(0),
    shape_normalized: new FormControl<string>('', [Validators.required]),
    dim_l_mm: new FormControl<number | null>(null, [Validators.required, Validators.min(0)]),
    dim_w_mm: new FormControl<number | null>(null, [Validators.required, Validators.min(0)]),
    is_dynamic_by_size: new FormControl<boolean>(false),
    size_wt_matrix: new FormArray<FormGroup<SizeQuantityMatrixForm>>([])
  });

  override ngOnInit() {
    this.form.patchValue({
      zone_slot_id: this.dialogData.zone_slot_id,
      shape_normalized: this.dialogData.shape_normalized,
      dim_l_mm: this.dialogData.dim_l_mm,
      dim_w_mm: this.dialogData.dim_w_mm,
      is_dynamic_by_size: this.dialogData.is_dynamic_by_size
    });

    const matrixArray = this.form.get('size_wt_matrix') as FormArray;

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

  public getSizeWtMatrixArray(): FormArray {
    return this.form.get('size_wt_matrix') as FormArray;
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    console.log(this.form.value)

    this.httpPutPromise<IGenericResponse<null>, any>(this.apiRoutes.Blueprint_Zone_Config.UPDATE, this.form.value)
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


  }

  onCancel() {
    this.dialogRef.close();
  }
}
