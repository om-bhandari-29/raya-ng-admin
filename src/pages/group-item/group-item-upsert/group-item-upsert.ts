import { Component, OnInit, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Base } from '../../../core/base/base';
import { IGenericResponse } from '../../../core/response/genericResponse.interface';
import {
  IComboItem,
  IComboHsnCode,
  IComboItemFrappeBased,
} from '../../../core/response/combo.interface';
import { IGroupItem } from '../group-item.response';
import { BreadcrumbService } from '../../../core/services/breadcrumb.service';
import { APPRoutes } from '../../../core/constant/app-routes';

export interface GroupItemForm {
  name: FormControl<string>;
  parent_item_group_id: FormControl<string>;
  is_group: FormControl<boolean>;
  gst_hsn_code: FormControl<string>;
  is_active: FormControl<boolean>;
}

@Component({
  selector: 'app-group-item-upsert',
  imports: [ReactiveFormsModule],
  templateUrl: './group-item-upsert.html',
  styleUrl: './group-item-upsert.scss',
})
export class GroupItemUpsert extends Base implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private breadcrumb = inject(BreadcrumbService);

  isEditMode = signal<boolean>(false);
  isLoading = signal<boolean>(false);
  isSaving = signal<boolean>(false);
  errorMessage = signal<string | null>(null);
  itemId = signal<number>(0);

  itemGroupOptions = signal<IComboItemFrappeBased[]>([]);
  hsnCodeOptions = signal<IComboHsnCode[]>([]);

  form = new FormGroup<GroupItemForm>({
    name: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(2)],
    }),
    parent_item_group_id: new FormControl<string>('', { nonNullable: true }),
    is_group: new FormControl<boolean>(false, { nonNullable: true }),
    gst_hsn_code: new FormControl<string>('', { nonNullable: true }),
    is_active: new FormControl<boolean>(true, { nonNullable: true }),
  });

  override ngOnInit(): void {
    super.ngOnInit();
    const idParam = this.route.snapshot.queryParamMap.get('id');
    if (idParam && idParam !== '0') {
      this.itemId.set(+idParam);
      this.isEditMode.set(true);
      this.breadcrumb.set([
        { label: 'Stock', url: APPRoutes.STOCK.ROOT },
        { label: 'Item Group', url: 'stock/item-group' },
        { label: 'Edit Item Group' },
      ]);
      this.loadItem();
    } else {
      this.breadcrumb.set([
        { label: 'Stock', url: APPRoutes.STOCK.ROOT },
        { label: 'Item Group', url: 'stock/item-group' },
        { label: 'Add Item Group' },
      ]);
    }
    this.loadDropdowns();

    this.setHeaderConfig('New Item Group', 'Save');
  }

  private async loadDropdowns(): Promise<void> {
    try {
      const [groups, hsn] = await Promise.all([
        this.httpGetPromise<IGenericResponse<IComboItemFrappeBased[]>>(
          this.apiRoutes.item_group.COMBO,
        ),
        this.httpGetPromise<IGenericResponse<IComboHsnCode[]>>(this.apiRoutes.gst_hsn_code.COMBO),
      ]);
      this.itemGroupOptions.set(groups.status ? groups.data : []);
      this.hsnCodeOptions.set(hsn.status ? hsn.data : []);
    } catch {
      // non-critical — dropdowns will just be empty
    }
  }

  private async loadItem(): Promise<void> {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    try {
      const url = this.apiRoutes.item_group.GET_BY_ID(this.itemId());
      const response = await this.httpGetPromise<IGenericResponse<IGroupItem>>(url);

      if (response.status) {
        this.form.patchValue({
          name: response.data.name,
          parent_item_group_id: response.data.parent_item_group_id ?? '',
          is_group: response.data.is_group,
          gst_hsn_code: response.data.gst_hsn_code ?? '',
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

  public override onActionButtonClick(): void {
    this.onSubmit();
  }

  async onSubmit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSaving.set(true);
    this.errorMessage.set(null);

    try {
      const raw = this.form.getRawValue();
      const payload = {
        name: raw.name,
        is_group: raw.is_group,
        gst_hsn_code: raw.gst_hsn_code || null,
        parent_item_group_id: raw.parent_item_group_id || null,
        is_active: raw.is_active,
      };

      if (this.isEditMode()) {
        await this.httpPatchPromise<IGenericResponse<IGroupItem>, typeof payload>(
          this.apiRoutes.item_group.UPDATE(this.itemId()),
          payload,
        );
      } else {
        await this.httpPostPromise<IGenericResponse<IGroupItem>, typeof payload>(
          this.apiRoutes.item_group.CREATE,
          payload,
        );
      }

      this.toastr.success(`Item group ${this.isEditMode() ? 'updated' : 'created'} successfully.`);
      this.router.navigate(['stock/item-group']);
    } catch {
      this.errorMessage.set('Failed to save. Please try again.');
    } finally {
      this.isSaving.set(false);
    }
  }

  onCancel(): void {
    this.router.navigate(['stock/item-group']);
  }

  get f() {
    return this.form.controls;
  }
}
