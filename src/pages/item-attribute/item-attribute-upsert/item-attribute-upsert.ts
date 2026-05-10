import { Component, OnInit, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Base } from '../../../core/base/base';
import { IGenericResponse } from '../../../core/response/genericResponse.interface';
import { IItemAttribute, IItemAttributeValue } from '../item-attribute.response';

export interface ItemAttributeForm {
  attribute_name: FormControl<string>;
  status: FormControl<boolean>;
  is_base_attribute: FormControl<boolean>;
  numeric_values: FormControl<boolean>;
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

  isEditMode = signal<boolean>(false);
  isLoading = signal<boolean>(false);
  isSaving = signal<boolean>(false);
  errorMessage = signal<string | null>(null);
  attributeId = signal<number>(0);

  values = signal<IItemAttributeValue[]>([]);
  editingValueId = signal<number | null>(null);

  form = new FormGroup<ItemAttributeForm>({
    attribute_name: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(2), Validators.maxLength(255)],
    }),
    status: new FormControl<boolean>(true, { nonNullable: true }),
    is_base_attribute: new FormControl<boolean>(false, { nonNullable: true }),
    numeric_values: new FormControl<boolean>(false, { nonNullable: true }),
  });

  override ngOnInit(): void {
    super.ngOnInit();
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam && idParam !== 'new') {
      this.attributeId.set(+idParam);
      this.isEditMode.set(true);
      this.loadAttribute();
    }
  }

  private async loadAttribute(): Promise<void> {
    this.isLoading.set(true);
    this.errorMessage.set(null);
    try {
      const response = await this.httpGetPromise<IGenericResponse<IItemAttribute>>(
        this.apiRoutes.item_attribute.GET_BY_ID(this.attributeId()),
      );
      if (response.status) {
        this.form.patchValue({
          attribute_name: response.data.attribute_name,
          status: response.data.status,
          is_base_attribute: response.data.is_base_attribute,
          numeric_values: response.data.numeric_values,
        });
        this.values.set(response.data.values || []);
      } else {
        this.errorMessage.set(response.message);
      }
    } catch {
      this.errorMessage.set('Failed to load attribute. Please try again.');
    } finally {
      this.isLoading.set(false);
    }
  }

  addValue(): void {
    const newValue: IItemAttributeValue = {
      id: 0,
      attribute_id: this.attributeId(),
      attribute_value: '',
      attribute_type: null,
      abbreviation: null,
      purity_factor: 0,
    };
    this.values.update((v) => [...v, newValue]);
    this.editingValueId.set(0);
  }

  editValue(id: number): void {
    this.editingValueId.set(id);
  }

  deleteValue(id: number): void {
    this.values.update((v) => v.filter((val) => val.id !== id));
  }

  updateValueField(id: number, field: keyof IItemAttributeValue, value: any): void {
    this.values.update((vals) => vals.map((v) => (v.id === id ? { ...v, [field]: value } : v)));
  }

  cancelEdit(): void {
    this.editingValueId.set(null);
  }

  async onSave(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.isSaving.set(true);
    this.errorMessage.set(null);
    try {
      const payload = {
        ...this.form.getRawValue(),
        values: this.values(),
      };
      if (this.isEditMode()) {
        await this.httpPatchPromise<IGenericResponse<IItemAttribute>, typeof payload>(
          this.apiRoutes.item_attribute.UPDATE(this.attributeId()),
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
    } catch {
      this.errorMessage.set('Failed to save attribute. Please try again.');
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
