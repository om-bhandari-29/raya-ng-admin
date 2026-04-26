import { Component, OnInit, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Base } from '../../../core/base/base';
import { IGenericResponse } from '../../../core/response/genericResponse.interface';
import { IGroupItem } from '../group-item.response';

export interface GroupItemDialogData {
  /** 0 for create, positive id for edit */
  itemId: number;
}

export interface GroupItemForm {
  name: FormControl<string>;
  is_active: FormControl<boolean>;
}

@Component({
  selector: 'app-group-item-upsert',
  imports: [ReactiveFormsModule],
  templateUrl: './group-item-upsert.html',
  styleUrl: './group-item-upsert.scss',
})
export class GroupItemUpsert extends Base implements OnInit {
  private dialogRef = inject(MatDialogRef<GroupItemUpsert>);
  private dialogData = inject<GroupItemDialogData>(MAT_DIALOG_DATA);

  isEditMode = signal<boolean>(false);
  isLoading = signal<boolean>(false);
  isSaving = signal<boolean>(false);
  errorMessage = signal<string | null>(null);

  form = new FormGroup<GroupItemForm>({
    name: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(2)],
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
      const url = this.apiRoutes.item_group.GET_BY_ID(this.dialogData.itemId);
      const response = await this.httpGetPromise<IGenericResponse<IGroupItem>>(url);

      if (response.status) {
        this.form.patchValue({
          name: response.data.name,
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
        const url = this.apiRoutes.item_group.UPDATE(this.dialogData.itemId);
        await this.httpPatchPromise<IGenericResponse<IGroupItem>, typeof payload>(url, payload);
      } else {
        await this.httpPostPromise<IGenericResponse<IGroupItem>, typeof payload>(
          this.apiRoutes.item_group.CREATE,
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

  get nameControl() { return this.form.controls.name; }
}
