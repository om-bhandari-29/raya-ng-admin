import { Component, OnInit, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Base } from '../../../core/base/base';
import { IGenericResponse } from '../../../core/response/genericResponse.interface';
import { IGstHsnCode } from '../gst-hsn-code.response';

export interface GstHsnCodeForm {
  hsn_code: FormControl<string>;
  description: FormControl<string>;
}

@Component({
  selector: 'app-gst-hsn-code-upsert',
  imports: [ReactiveFormsModule],
  templateUrl: './gst-hsn-code-upsert.html',
  styleUrl: './gst-hsn-code-upsert.scss',
})
export class GstHsnCodeUpsert extends Base implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  isEditMode = signal<boolean>(false);
  isLoading = signal<boolean>(false);
  isSaving = signal<boolean>(false);
  errorMessage = signal<string | null>(null);
  itemId = signal<number>(0);

  form = new FormGroup<GstHsnCodeForm>({
    hsn_code: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    description: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  override ngOnInit(): void {
    super.ngOnInit();
    const idParam = this.route.snapshot.queryParamMap.get('id');
    if (idParam && +idParam !== 0) {
      this.itemId.set(+idParam);
      this.isEditMode.set(true);
      this.setHeaderConfig('Edit GST HSN Code', 'Update');
      this.loadItem();
    } else {
      this.setHeaderConfig('New GST HSN Code', 'Save');
    }
  }

  public override onActionButtonClick(): void {
    this.onSubmit();
  }

  private async loadItem(): Promise<void> {
    this.isLoading.set(true);
    this.errorMessage.set(null);
    try {
      const url = this.apiRoutes.gst_hsn_code.GET_BY_ID(this.itemId());
      const response = await this.httpGetPromise<IGenericResponse<IGstHsnCode>>(url);
      if (response.status) {
        this.form.patchValue({
          hsn_code: response.data.hsn_code,
          description: response.data.description,
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
      const payload = { ...this.form.getRawValue(), gst_rate: null, is_active: true };
      if (this.isEditMode()) {
        await this.httpPatchPromise<IGenericResponse<IGstHsnCode>, typeof payload>(
          this.apiRoutes.gst_hsn_code.UPDATE(this.itemId()),
          payload,
        );
      } else {
        await this.httpPostPromise<IGenericResponse<IGstHsnCode>, typeof payload>(
          this.apiRoutes.gst_hsn_code.CREATE,
          payload,
        );
      }
      this.toastr.success('GST HSN Code saved successfully.');
      this.router.navigate([this.appRoutes.GST_HSN_CODE]);
    } catch {
      this.errorMessage.set('Failed to save. Please try again.');
    } finally {
      this.isSaving.set(false);
    }
  }

  onCancel(): void {
    this.router.navigate([this.appRoutes.GST_HSN_CODE]);
  }

  get hsnCodeControl() {
    return this.form.controls.hsn_code;
  }
  get descriptionControl() {
    return this.form.controls.description;
  }
}
