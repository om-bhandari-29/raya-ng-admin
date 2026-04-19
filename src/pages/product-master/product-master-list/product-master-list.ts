import { Component, OnInit, inject, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Base } from '../../../core/base/base';
import { IGenericResponse } from '../../../core/response/genericResponse.interface';
import { IProductMaster } from '../product-master.response';
import { ProductMasterUpsert, ProductMasterDialogData } from '../product-master-upsert/product-master-upsert';

@Component({
  selector: 'app-product-master-list',
  imports: [],
  templateUrl: './product-master-list.html',
  styleUrl: './product-master-list.scss',
})
export class ProductMasterList extends Base implements OnInit {
  private dialog = inject(MatDialog);

  productMasters = signal<IProductMaster[]>([]);
  isLoading = signal<boolean>(false);
  errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    this.getAll();
  }

  openAddModal(): void {
    this.openModal(0);
  }

  openEditModal(id: number): void {
    this.openModal(id);
  }

  private openModal(itemId: number): void {
    const data: ProductMasterDialogData = { itemId };

    const dialogRef = this.dialog.open(ProductMasterUpsert, {
      width: '480px',
      disableClose: true,
      data,
    });

    dialogRef.afterClosed().subscribe((saved: boolean) => {
      if (saved) this.getAll();
    });
  }

  private async getAll(): Promise<void> {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    try {
      const response = await this.httpGetPromise<IGenericResponse<IProductMaster[]>>(
        this.apiRoutes.product_master.GET_ALL
      );

      if (response.status) {
        this.productMasters.set(response.data);
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
