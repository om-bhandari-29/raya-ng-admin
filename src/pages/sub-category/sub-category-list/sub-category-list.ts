import { Component, OnInit, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { HttpErrorResponse } from '@angular/common/http';
import { ListBase } from '../../../core/base/list-base';
import { IGenericResponse } from '../../../core/response/genericResponse.interface';
import { ISubCategory } from '../sub-category.response';
import {
  SubCategoryUpsert,
  SubCategoryDialogData,
} from '../sub-category-upsert/sub-category-upsert';
import { TableLayout, TableSlot } from '../../../core/component/table-layout/table-layout';
import { TableColumn } from '../../../core/models/table-column.interface';
import { SidebarMode } from '../../../core/enum/sidebar-mode.enum';

@Component({
  selector: 'app-sub-category-list',
  imports: [TableLayout, TableSlot],
  templateUrl: './sub-category-list.html',
  styleUrl: './sub-category-list.scss',
})
export class SubCategoryList extends ListBase<ISubCategory> implements OnInit {
  private dialog = inject(MatDialog);

  // Define table columns - Simple and clean!
  columns: TableColumn<ISubCategory>[] = [
    {
      key: 'name',
      header: 'ID',
      // width: '120px',
      slot: 'id', // Custom template for clickable ID
    },
    {
      key: 'item_group.name_frappe_based_id', // Nested property - automatic!
      header: 'Item Group',
      type: 'text',
    },
    // {
    //   key: 'is_active',
    //   header: 'Is Active',
    //   type: 'boolean', // Automatic checkmark icon
    // },
  ];

  override ngOnInit(): void {
    super.ngOnInit();
    this.loadItems();
    this.setHeaderConfig('Item Sub-Category', 'Add Item Sub-Category');
    this.sidebarService.setMode(SidebarMode.SUB_CATEGORY_LIST);
  }

  protected override onActionButtonClick(): void {
    this.openAddModal();
  }

  openAddModal(): void {
    this.openModal(0);
  }

  openEditModal(id: number): void {
    this.openModal(id);
  }

  private openModal(itemId: number): void {
    const data: SubCategoryDialogData = { itemId };

    const dialogRef = this.dialog.open(SubCategoryUpsert, {
      width: '480px',
      disableClose: true,
      data,
    });

    dialogRef.afterClosed().subscribe((saved: boolean) => {
      if (saved) this.loadItems();
    });
  }

  async delete(id: number): Promise<void> {
    if (!confirm('Are you sure you want to delete this sub category?')) return;

    try {
      const response = await this.httpDeletePromise<IGenericResponse<null>>(
        this.apiRoutes.sub_category.DELETE(id),
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
      const response = await this.httpGetPromise<IGenericResponse<ISubCategory[]>>(
        this.apiRoutes.sub_category.GET_ALL,
      );

      if (response.status) {
        this.items.set(response.data);
      } else {
        this.errorMessage.set(response.message);
      }
    } catch {
      this.errorMessage.set('Failed to load sub categories. Please try again.');
    } finally {
      this.isLoading.set(false);
    }
  }
}
