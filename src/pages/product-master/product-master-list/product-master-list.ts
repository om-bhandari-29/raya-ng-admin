import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ListBase } from '../../../core/base/list-base';
import { IGenericResponse } from '../../../core/response/genericResponse.interface';
import { IProductMaster } from '../product-master.response';
import { TableLayout } from '../../../core/component/table-layout/table-layout';
import { TableColumn } from '../../../core/models/table-column.interface';
import { APPRoutes } from '../../../core/constant/app-routes';

@Component({
  selector: 'app-product-master-list',
  imports: [TableLayout],
  templateUrl: './product-master-list.html',
  styleUrl: './product-master-list.scss',
})
export class ProductMasterList extends ListBase<IProductMaster> implements OnInit {
  private router = inject(Router);

  columns: TableColumn<IProductMaster>[] = [
    {
      key: 'name',
      header: 'ID',
      width: '150px',
      slot: 'id',
    },
    {
      key: 'name',
      header: 'Product Name',
      type: 'text',
      cellClass: 'text-gray-800 font-medium',
    },
    {
      key: 'sub_category.name',
      header: 'Sub Category',
      type: 'text',
    },
    {
      key: 'labour_rate',
      header: 'Labour Rate',
      type: 'custom',
      format: (value, item) => (value ? `${value} (${item.labour_rate_on})` : '-'),
    },
    {
      key: 'is_active',
      header: 'Is Active',
      type: 'boolean',
    },
  ];

  override ngOnInit(): void {
    super.ngOnInit();
    this.loadItems();
    this.setHeaderConfig('Product Master', 'Add Product Master');
  }

  protected override onActionButtonClick(): void {
    this.navigateToUpsert(0);
  }

  openEditModal(id: number): void {
    this.navigateToUpsert(id);
  }

  private navigateToUpsert(id: number): void {
    this.router.navigate([APPRoutes.PRODUCT_MASTER_UPSERT], { queryParams: { id } });
  }

  async delete(id: number): Promise<void> {
    if (!confirm('Are you sure you want to delete this product master?')) return;

    try {
      const response = await this.httpDeletePromise<IGenericResponse<null>>(
        this.apiRoutes.product_master.DELETE(id),
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
      const response = await this.httpGetPromise<IGenericResponse<IProductMaster[]>>(
        this.apiRoutes.product_master.GET_ALL,
      );

      if (response.status) {
        this.items.set(response.data);
      } else {
        this.errorMessage.set(response.message);
      }
    } catch {
      this.errorMessage.set('Failed to load product masters. Please try again.');
    } finally {
      this.isLoading.set(false);
    }
  }
}
