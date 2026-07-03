import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ListBase } from '../../../core/base/list-base';
import { IGenericResponse } from '../../../core/response/genericResponse.interface';
import { IItem } from '../item.response';
import { TableLayout } from '../../../core/component/table-layout/table-layout';
import { TableColumn } from '../../../core/models/table-column.interface';
import { BreadcrumbService } from '../../../core/services/breadcrumb.service';
import { APPRoutes } from '../../../core/constant/app-routes';

@Component({
  selector: 'app-item-list',
  imports: [TableLayout],
  templateUrl: './item-list.html',
  styleUrl: './item-list.scss',
})
export class ItemList extends ListBase<IItem> implements OnInit {
  private router = inject(Router);
  

  columns: TableColumn<IItem>[] = [
    {
      key: 'name',
      header: 'ID',
      width: '150px',
      slot: 'id',
    },
    {
      key: 'name',
      header: 'Item Name',
      type: 'text',
      cellClass: 'text-gray-800 font-medium',
    },
    {
      key: 'item_group.name',
      header: 'Item Group',
      type: 'text',
    },
    {
      key: 'product_master.name',
      header: 'Product Master',
      type: 'text',
    },
    {
      key: 'has_variants',
      header: 'Has Variants',
      type: 'boolean',
    },
    {
      key: 'is_disabled',
      header: 'Is Active',
      slot: 'is_active',
    },
  ];

  override ngOnInit(): void {
    super.ngOnInit();
    this.breadcrumb.set([{ label: 'Stock', url: APPRoutes.STOCK.ROOT }, { label: 'Item' }]);
    this.loadItems();
    this.setHeaderConfig('Stock', 'Add Stock');
  }

  protected override onActionButtonClick(): void {
    this.openAdd();
  }

  openAdd(): void {
    this.router.navigate(['/stock/item/upsert'], { queryParams: { id: 0 } });
  }

  openEdit(id: number): void {
    this.router.navigate(['/stock/item/upsert'], { queryParams: { id } });
  }

  async deleteItem(id: number): Promise<void> {
    try {
      const res = await this.httpDeletePromise<IGenericResponse<null>>(
        this.apiRoutes.item.DELETE(id),
      );
      if (res.status) {
        this.items.update((list) => list.filter((i) => i.id !== id));
        this.toastr.success('Item deleted successfully.');
      } else {
        this.toastr.error(res.message);
      }
    } catch {
      this.toastr.error('Failed to delete item. Please try again.');
    }
  }

  async loadItems(): Promise<void> {
    this.isLoading.set(true);
    this.errorMessage.set(null);
    try {
      const response = await this.httpGetPromise<IGenericResponse<IItem[]>>(
        this.apiRoutes.item.GET_ALL,
      );
      if (response.status) {
        this.items.set(response.data);
      } else {
        this.errorMessage.set(response.message);
      }
    } catch {
      this.errorMessage.set('Failed to load items. Please try again.');
    } finally {
      this.isLoading.set(false);
    }
  }
}
