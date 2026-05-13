import { Component, OnInit, inject, signal } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Base } from '../../../core/base/base';
import { IGenericResponse } from '../../../core/response/genericResponse.interface';
import { IItemAttribute, IItemAttributeValue } from '../item-attribute.response';
import { BreadcrumbService } from '../../../core/services/breadcrumb.service';
import { HttpErrorResponse } from '@angular/common/http';

export interface ItemAttributeForm {
  name: FormControl<string>;
  status: FormControl<boolean>;
  is_base_attribute: FormControl<boolean>;
  numeric_values: FormControl<boolean>;
  from_range: FormControl<string>;
  to_range: FormControl<string>;
  increment: FormControl<string>;
  values: FormArray<FormGroup<ValueFormGroup>>;
}

export interface ValueFormGroup {
  name: FormControl<string>;
  attribute_type: FormControl<string>;
  abbreviation: FormControl<string>;
  purity_factor: FormControl<number>;
}

@Component({
  selector: 'app-item-attribute-upsert',
  imports: [ReactiveFormsModule],
  templateUrl: './item-attribute-upsert.html',
  styleUrl: './item-attribute-upsert.scss',
})
export class ItemAttributeUpsert extends Base implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private breadcrumbService = inject(BreadcrumbService);

  isEditMode = signal<boolean>(false);
  isLoading = signal<boolean>(false);
  isSaving = signal<boolean>(false);
  errorMessage = signal<string | null>(null);
  attributeName = signal<string>('');

  form = new FormGroup<ItemAttributeForm>({
    name: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(2), Validators.maxLength(255)],
    }),
    status: new FormControl<boolean>(true, { nonNullable: true }),
    is_base_attribute: new FormControl<boolean>(false, { nonNullable: true }),
    numeric_values: new FormControl<boolean>(false, { nonNullable: true }),
    from_range: new FormControl<string>('0.0000', { nonNullable: true }),
    to_range: new FormControl<string>('0.0000', { nonNullable: true }),
    increment: new FormControl<string>('0.0000', { nonNullable: true }),
    values: new FormArray<FormGroup<ValueFormGroup>>([]),
  });

  get valuesArray(): FormArray<FormGroup<ValueFormGroup>> {
    return this.form.controls.values;
  }

  override ngOnInit(): void {
    super.ngOnInit();
    const nameParam = this.route.snapshot.queryParamMap.get('id');
    if (nameParam && nameParam !== 'new') {
      this.attributeName.set(nameParam);
      this.isEditMode.set(true);
      this.breadcrumbService.set([
        { label: 'Item Attribute', url: `/${this.appRoutes.ITEM_ATTRIBUTE}` },
        { label: 'Edit Item Attribute' },
      ]);
      this.setHeaderConfig(this.attributeName(), 'Update');
      this.loadAttribute();
    } else {
      this.breadcrumbService.set([
        { label: 'Item Attribute', url: `/${this.appRoutes.ITEM_ATTRIBUTE}` },
        { label: 'New Item Attribute' },
      ]);
      this.setHeaderConfig('New Item Attribute', 'Save');
    }
  }

  private async loadAttribute(): Promise<void> {
    this.isLoading.set(true);
    this.errorMessage.set(null);
    try {
      const response = await this.httpGetPromise<IGenericResponse<IItemAttribute>>(
        this.apiRoutes.item_attribute.GET_BY_ID(this.attributeName()),
      );
      if (response.status) {
        this.form.patchValue({
          name: response.data.name,
          status: response.data.status,
          is_base_attribute: response.data.is_base_attribute,
          numeric_values: response.data.numeric_values,
          from_range: response.data.from_range ?? '0.0000',
          to_range: response.data.to_range ?? '0.0000',
          increment: response.data.increment ?? '0.0000',
        });
        this.valuesArray.clear();
        (response.data.values || []).forEach((v) => this.addValue(v));
      } else {
        this.errorMessage.set(response.message);
      }
    } catch {
      this.errorMessage.set('Failed to load attribute. Please try again.');
    } finally {
      this.isLoading.set(false);
    }
  }

  addValue(value?: IItemAttributeValue): void {
    this.valuesArray.push(
      new FormGroup<ValueFormGroup>({
        name: new FormControl(value?.name ?? '', { nonNullable: true }),
        attribute_type: new FormControl(value?.attribute_type ?? '', { nonNullable: true }),
        abbreviation: new FormControl(value?.abbreviation ?? '', { nonNullable: true }),
        purity_factor: new FormControl(value?.purity_factor ?? 0, { nonNullable: true }),
      }),
    );
  }

  deleteValue(index: number): void {
    this.valuesArray.removeAt(index);
  }

  protected override onActionButtonClick(): void {
    this.onSave();
  }

  async onSave(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.isSaving.set(true);
    this.errorMessage.set(null);
    try {
      const formValue = this.form.getRawValue();
      // console.log(formValue);

      const payload = {
        ...formValue,
        from_range: parseFloat(formValue.from_range) || 0,
        to_range: parseFloat(formValue.to_range) || 0,
        increment: parseFloat(formValue.increment) || 0,
        values: formValue.values.map((v) => ({
          name: v.name,
          attribute_type: v.attribute_type || null,
          abbreviation: v.abbreviation || null,
          purity_factor: v.purity_factor,
        })),
      };

      // console.log(payload);
      // return;

      if (this.isEditMode()) {
        await this.httpPatchPromise<IGenericResponse<IItemAttribute>, typeof payload>(
          this.apiRoutes.item_attribute.UPDATE(this.attributeName()),
          payload,
        );
      } else {
        await this.httpPostPromise<IGenericResponse<IItemAttribute>, typeof payload>(
          this.apiRoutes.item_attribute.CREATE,
          payload,
        );
      }
      this.toastr.success('Item attribute saved successfully.');
      this.router.navigate([this.appRoutes.ITEM_ATTRIBUTE]);
    } catch (err) {
      this.errorMessage.set((err as HttpErrorResponse).error.message);
    } finally {
      this.isSaving.set(false);
    }
  }

  onCancel(): void {
    this.router.navigate([this.appRoutes.ITEM_ATTRIBUTE]);
  }

  get f() {
    return this.form.controls;
  }
}
