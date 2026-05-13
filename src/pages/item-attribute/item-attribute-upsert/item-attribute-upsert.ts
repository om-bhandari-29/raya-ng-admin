import { Component, OnInit, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Base } from '../../../core/base/base';
import { IGenericResponse } from '../../../core/response/genericResponse.interface';
import { IItemAttribute, IItemAttributeValue } from '../item-attribute.response';
import { BreadcrumbService } from '../../../core/services/breadcrumb.service';

export interface ItemAttributeForm {
  name: FormControl<string>;
  status: FormControl<boolean>;
  is_base_attribute: FormControl<boolean>;
  numeric_values: FormControl<boolean>;
  from_range: FormControl<string>;
  to_range: FormControl<string>;
  increment: FormControl<string>;
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

  values = signal<IItemAttributeValue[]>([]);
  editingValueId = signal<number | null>(null);

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
  });

  override ngOnInit(): void {
    super.ngOnInit();
    const nameParam = this.route.snapshot.paramMap.get('id');
    if (nameParam && nameParam !== 'new') {
      this.attributeName.set(nameParam);
      this.isEditMode.set(true);
      this.breadcrumbService.set([
        { label: 'Item Attribute', url: `/${this.appRoutes.ITEM_ATTRIBUTE}` },
        { label: 'Edit Item Attribute' },
      ]);
      this.setHeaderConfig('Edit Item Attribute', 'Update');
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
      attribute_id: 0,
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
      const payload = {
        ...this.form.getRawValue(),
        values: this.values(),
      };
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
