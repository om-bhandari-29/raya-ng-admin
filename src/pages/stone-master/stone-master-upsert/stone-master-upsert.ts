import { Component, OnInit, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Base } from '../../../core/base/base';
import { IGenericResponse } from '../../../core/response/genericResponse.interface';
import { IStoneMaster } from '../stone-master.response';
import { StoneMasterType } from '../../../core/enum/stone-master.enum';

export interface StoneMasterDialogData {
  itemId: number;
  type: StoneMasterType;
  typeLabel: string;
}

interface StoneMasterForm {
  name: FormControl<string>;
  is_published: FormControl<boolean>;
}

@Component({
  selector: 'app-stone-master-upsert',
  imports: [ReactiveFormsModule],
  templateUrl: './stone-master-upsert.html',
  styleUrl: './stone-master-upsert.scss',
})
export class StoneMasterUpsert extends Base implements OnInit {
  private dialogRef = inject(MatDialogRef<StoneMasterUpsert>);
  private dialogData = inject<StoneMasterDialogData>(MAT_DIALOG_DATA);

  isEditMode = signal<boolean>(false);
  isLoading = signal<boolean>(false);
  isSaving = signal<boolean>(false);
  errorMessage = signal<string | null>(null);

  get typeLabel() {
    return this.dialogData.typeLabel;
  }

  form = new FormGroup<StoneMasterForm>({
    name: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(2), Validators.maxLength(255)],
    }),
    is_published: new FormControl<boolean>(true, { nonNullable: true }),
  });

  override ngOnInit(): void {
    super.ngOnInit();
    if (this.dialogData.itemId !== 0) {
      this.isEditMode.set(true);
      this.loadItem();
    }
  }

  private get routes() {
    const t = this.dialogData.type;
    return t === StoneMasterType.FAMILY
      ? this.apiRoutes.stone_family
      : t === StoneMasterType.CLARITY
        ? this.apiRoutes.stone_clarity
        : this.apiRoutes.stone_shape;
  }

  private async loadItem(): Promise<void> {
    this.isLoading.set(true);
    this.errorMessage.set(null);
    try {
      const res = await this.httpGetPromise<IGenericResponse<IStoneMaster>>(
        this.routes.GET_BY_ID(this.dialogData.itemId),
      );
      if (res.status) {
        this.form.patchValue({ name: res.data.name, is_published: res.data.is_published });
      } else {
        this.errorMessage.set(res.message);
      }
    } catch {
      this.errorMessage.set('Failed to load. Please try again.');
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
        await this.httpPatchPromise<IGenericResponse<IStoneMaster>, typeof payload>(
          this.routes.UPDATE(this.dialogData.itemId),
          payload,
        );
      } else {
        await this.httpPostPromise<IGenericResponse<IStoneMaster>, typeof payload>(
          this.routes.CREATE,
          payload,
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

  get nameControl() {
    return this.form.controls.name;
  }
}
