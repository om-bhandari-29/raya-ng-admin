import { Component, OnInit, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { HttpErrorResponse } from '@angular/common/http';
import { ListBase } from '../../../core/base/list-base';
import { IGenericResponse } from '../../../core/response/genericResponse.interface';
import { IGroupItem } from '../group-item.response';
import { GroupItemUpsert, GroupItemDialogData } from '../group-item-upsert/group-item-upsert';
import { TableLayout } from '../../../core/component/table-layout/table-layout';
import { TableColumn } from '../../../core/models/table-column.interface';
import { BreadcrumbService } from '../../../core/services/breadcrumb.service';
import { APPRoutes } from '../../../core/constant/app-routes';

@Component({
  selector: 'app-group-item-list',
  imports: [TableLayout],
  templateUrl: './group-item-list.html',
  styleUrl: './group-item-list.scss',
})
export class GroupItemList extends ListBase<IGroupItem> implements OnInit {
  private dialog = inject(MatDialog);
  private breadcrumb = inject(BreadcrumbService);

  // Define table columns
  columns: TableColumn<IGroupItem>[] = [
    {
      key: 'name',
      header: 'ID',
      width: '120px',
      slot: 'id',  // Use custom template for clickable ID
    },
    {
      key: 'name',
      header: 'Item Group Name',
      type: 'text',
      cellClass: 'text-gray-800 font-medium'
    },
    {
      key: 'parent',
      header: 'Parent Item Group',
      type: 'text',
      format: (value) => value || '-'
    },
    {
      key: 'is_active',
      header: 'Is Group',
      type: 'boolean'
    }
  ];

  ngOnInit(): void {
    this.breadcrumb.set([
      { label: 'Stock', url: APPRoutes.STOCK },
      { label: 'Item Group' }
    ]);
    this.loadItems();
  }

  openAddModal(): void {
    this.openModal(0);
  }

  openEditModal(id: number): void {
    this.openModal(id);
  }

  private openModal(itemId: number): void {
    const data: GroupItemDialogData = { itemId };

    const dialogRef = this.dialog.open(GroupItemUpsert, {
      width: '480px',
      disableClose: true,
      data,
    });

    dialogRef.afterClosed().subscribe((saved: boolean) => {
      if (saved) {
        this.loadItems();
      }
    });
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
      const message = err instanceof HttpErrorResponse
        ? err.error?.message ?? 'Failed to delete item. Please try again.'
        : 'Failed to delete item. Please try again.';
      this.toastr.error(message);
    }
  }

  async loadItems(): Promise<void> {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    try {
      const response = await this.httpGetPromise<IGenericResponse<IGroupItem[]>>(
        this.apiRoutes.item_group.GET_ALL
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
