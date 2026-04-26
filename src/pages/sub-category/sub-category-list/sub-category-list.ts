import { Component, OnInit, inject, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { HttpErrorResponse } from '@angular/common/http';
import { Base } from '../../../core/base/base';
import { IGenericResponse } from '../../../core/response/genericResponse.interface';
import { ISubCategory } from '../sub-category.response';
import { SubCategoryUpsert, SubCategoryDialogData } from '../sub-category-upsert/sub-category-upsert';

@Component({
  selector: 'app-sub-category-list',
  imports: [],
  templateUrl: './sub-category-list.html',
  styleUrl: './sub-category-list.scss',
})
export class SubCategoryList extends Base implements OnInit {
  private dialog = inject(MatDialog);

  subCategories = signal<ISubCategory[]>([]);
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
    const data: SubCategoryDialogData = { itemId };

    const dialogRef = this.dialog.open(SubCategoryUpsert, {
      width: '480px',
      disableClose: true,
      data,
    });

    dialogRef.afterClosed().subscribe((saved: boolean) => {
      if (saved) this.getAll();
    });
  }

  async delete(id: number): Promise<void> {
    if (!confirm('Are you sure you want to delete this sub category?')) return;

    try {
      const response = await this.httpDeletePromise<IGenericResponse<null>>(
        this.apiRoutes.sub_category.DELETE(id)
      );
      if (response.status) {
        this.getAll();
      } else {
        this.errorMessage.set(response.message);
      }
    } catch (err) {
      const message = err instanceof HttpErrorResponse
        ? err.error?.message ?? 'Failed to delete. Please try again.'
        : 'Failed to delete. Please try again.';
      this.toastr.error(message);
    }
  }

  private async getAll(): Promise<void> {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    try {
      const response = await this.httpGetPromise<IGenericResponse<ISubCategory[]>>(
        this.apiRoutes.sub_category.GET_ALL
      );

      if (response.status) {
        this.subCategories.set(response.data);
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
