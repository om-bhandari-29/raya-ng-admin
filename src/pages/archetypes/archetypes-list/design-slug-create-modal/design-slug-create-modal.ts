import { Component, inject, OnInit, signal } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Base } from '../../../../core/base/base';
import { IGenericResponse } from '../../../../core/response/genericResponse.interface';
import { HttpErrorResponse } from '@angular/common/http';

export interface VariantCreatePayload {
  variant_name: string;
  target_gender: string;
  design_slug: string;
}

@Component({
  selector: 'app-design-slug-create-modal',
  imports: [ReactiveFormsModule],
  templateUrl: './design-slug-create-modal.html',
  styleUrl: './design-slug-create-modal.scss',
})
export class DesignSlugCreateModal extends Base implements OnInit {
  private dialogRef = inject(MatDialogRef<DesignSlugCreateModal>);
  public isBtnLoader = signal<boolean>(false);

  form = new FormGroup({
    design_slug: new FormControl<string>('', [Validators.required]),
    variants: new FormArray<FormGroup>([]),
  });

  get variantsArray() {
    return this.form.get('variants') as FormArray<FormGroup>;
  }

  override ngOnInit() {
    this.addVariant(); // start with one variant row
  }

  addVariant() {
    const group = new FormGroup({
      variant_name: new FormControl<string>('', [Validators.required]),
      target_gender: new FormControl<string>('', [Validators.required]),
    });
    this.variantsArray.push(group);
  }

  removeVariant(index: number) {
    if (this.variantsArray.length > 1) {
      this.variantsArray.removeAt(index);
    }
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { design_slug, variants } = this.form.value;
    if (!design_slug || !variants || variants.length === 0) return;

    this.isBtnLoader.set(true);

    const payload = {
      design_slug: design_slug,
      variant: variants.map((v: any) => ({
        variant_name: v.variant_name || '',
        target_gender: v.target_gender || '',
      })),
    };

    this.httpPostPromise<IGenericResponse<number>, typeof payload>(
      this.apiRoutes.products_import.POST_BULK_VARIANT_UNDER_DESIGN, // placeholder until user provides the route
      payload
    )
      .then((res: IGenericResponse<number>) => {
        if (res.status) {
          this.dialogRef.close(res.data); //returns created design slug id
        } else {
          this.toastr.error(res.message || 'Failed to create design slug');
        }
      })
      .catch((err: HttpErrorResponse) => {
        this.toastr.error(err.error.message);
      })
      .finally(() => {
        this.isBtnLoader.set(false);
      });
  }

  onCancel() {
    this.dialogRef.close();
  }
}
