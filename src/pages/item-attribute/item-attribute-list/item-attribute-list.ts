import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ListBase } from '../../../core/base/list-base';
import { IGenericResponse } from '../../../core/response/genericResponse.interface';
import { IItemAttribute } from '../item-attribute.response';
import { TableLayout, TableSlot } from '../../../core/component/table-layout/table-layout';
import { TableColumn } from '../../../core/models/table-column.interface';

@Component({
  selector: 'app-item-attribute-list',
  imports: [TableLayout, TableSlot],
  templateUrl: './item-attribute-list.html',
  styleUrl: './item-attribute-list.scss',
})
export class ItemAttributeList extends ListBase<IItemAttribute> implements OnInit {
  private router = inject(Router);

  columns: TableColumn<IItemAttribute>[] = [
    {
      key: 'name',
      header: 'ID',
      slot: 'id',
    },
    {
      key: 'numeric_values',
      header: 'Type',
      type: 'badge',
      badgeConfig: {
        trueLabel: 'Numeric',
        falseLabel: 'Text',
        trueClass: 'bg-blue-100 text-blue-700',
        falseClass: 'bg-purple-100 text-purple-700',
      },
    },
    {
      key: 'values',
      header: 'Values',
      type: 'custom',
      format: (values) => (values?.length ? `${values.length} values` : 'No values'),
    },
    {
      key: 'status',
      header: 'Status',
      type: 'badge',
      badgeConfig: {
        trueLabel: 'Enabled',
        falseLabel: 'Disabled',
        trueClass: 'bg-green-100 text-green-700',
        falseClass: 'bg-red-100 text-red-600',
      },
    },
  ];

  override ngOnInit(): void {
    super.ngOnInit();
    this.loadItems();
    this.setHeaderConfig('Item Attribute', 'Add Item Attribute');
  }

  protected override onActionButtonClick(): void {
    this.openAdd();
  }

  openAdd(): void {
    this.router.navigate([this.appRoutes.ITEM_ATTRIBUTE, 'new']);
  }

  openEdit(name: string): void {
    this.router.navigate([this.appRoutes.ITEM_ATTRIBUTE, name]);
  }

  async delete(name: string): Promise<void> {
    if (!confirm('Are you sure you want to delete this item attribute?')) return;

    try {
      const response = await this.httpDeletePromise<IGenericResponse<null>>(
        this.apiRoutes.item_attribute.DELETE(name),
      );
      if (response.status) {
        this.loadItems();
      } else {
        this.errorMessage.set(response.message);
      }
    } catch (err) {
      const message =
        err instanceof HttpErrorResponse
          ? (err.error?.message ?? 'Failed to delete. Please try again.')
          : 'Failed to delete. Please try again.';
      this.toastr.error(message);
    }
  }

  async loadItems(): Promise<void> {
    this.isLoading.set(true);
    this.errorMessage.set(null);
    try {
      const response = await this.httpGetPromise<IGenericResponse<IItemAttribute[]>>(
        this.apiRoutes.item_attribute.GET_ALL,
      );
      if (response.status) {
        this.items.set(response.data);
      } else {
        this.errorMessage.set(response.message);
      }
    } catch {
      this.errorMessage.set('Failed to load item attributes. Please try again.');
    } finally {
      this.isLoading.set(false);
    }
  }
}
