import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ListBase } from '../../../core/base/list-base';
import { IGenericResponse } from '../../../core/response/genericResponse.interface';
import { IGroupItem } from '../group-item.response';
import { TableLayout, TableSlot } from '../../../core/component/table-layout/table-layout';
import { TableColumn } from '../../../core/models/table-column.interface';
import { BreadcrumbService } from '../../../core/services/breadcrumb.service';
import { APPRoutes } from '../../../core/constant/app-routes';

@Component({
  selector: 'app-group-item-list',
  imports: [TableLayout, TableSlot],
  templateUrl: './group-item-list.html',
  styleUrl: './group-item-list.scss',
})
export class GroupItemList extends ListBase<IGroupItem> implements OnInit {
  private router = inject(Router);
  private breadcrumb = inject(BreadcrumbService);

  columns: TableColumn<IGroupItem>[] = [
    {
      key: 'name_frappe_based_id',
      header: 'ID',
      width: '220px',
      slot: 'id',
    },
    {
      key: 'name_frappe_based_id',
      header: 'Item Group Name',
      type: 'text',
      width: '280px',
      cellClass: 'text-gray-800 font-medium',
    },
    {
      key: 'parent_item_group',
      header: 'Parent Item Group',
      type: 'text',
      format: (value) => value || '-',
    },
    {
      key: 'is_group',
      header: 'Is Group',
      type: 'boolean',
      width: '90px',
      align: 'center',
    },
  ];

  ngOnInit(): void {
    this.breadcrumb.set([{ label: 'Stock', url: APPRoutes.STOCK.ROOT }, { label: 'Item Group' }]);
    this.loadItems();
  }

  openAddModal(): void {
    this.router.navigate(['stock/item-group/upsert'], { queryParams: { id: 0 } });
  }

  openEditModal(id: number): void {
    this.router.navigate(['stock/item-group/upsert'], { queryParams: { id } });
  }

  async toggleLiked(item: IGroupItem): Promise<void> {
    const newLiked = !item.liked;
    try {
      await this.httpPostPromise<
        IGenericResponse<null>,
        { name_frappe_based_id: string; liked: boolean }
      >(this.apiRoutes.item_group.TOGGLE_LIKED, {
        name_frappe_based_id: item.name_frappe_based_id,
        liked: newLiked,
      });
      this.items.update((list) =>
        list.map((i) => (i.id === item.id ? { ...i, liked: newLiked } : i)),
      );
    } catch {
      this.toastr.error('Failed to update. Please try again.');
    }
  }

  async deleteGroupItem(id: number): Promise<void> {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      const url = this.apiRoutes.item_group.DELETE(id);
      const response = await this.httpDeletePromise<IGenericResponse<null>>(url);

      if (response.status) {
        this.loadItems();
      } else {
        this.errorMessage.set(response.message);
      }
    } catch (err) {
      const message =
        err instanceof HttpErrorResponse
          ? (err.error?.message ?? 'Failed to delete item. Please try again.')
          : 'Failed to delete item. Please try again.';
      this.toastr.error(message);
    }
  }

  async loadItems(): Promise<void> {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    try {
      const response = await this.httpGetPromise<IGenericResponse<IGroupItem[]>>(
        this.apiRoutes.item_group.GET_ALL,
      );

      if (response.status) {
        this.items.set(response.data);
      } else {
        this.errorMessage.set(response.message);
      }
    } catch {
      this.errorMessage.set('Failed to load item groups. Please try again.');
    } finally {
      this.isLoading.set(false);
    }
  }
}
