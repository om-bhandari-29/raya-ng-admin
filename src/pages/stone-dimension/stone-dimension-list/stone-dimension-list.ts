import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ListBase } from '../../../core/base/list-base';
import { IGenericResponse } from '../../../core/response/genericResponse.interface';
import { IStoneDimension, IStoneDimensionListResponse } from '../stone-dimension.response';
import { TableLayout } from '../../../core/component/table-layout/table-layout';
import { TableColumn } from '../../../core/models/table-column.interface';
import { APPRoutes } from '../../../core/constant/app-routes';
import { PageTitleService } from '../../../core/services/page-title.service';

@Component({
  selector: 'app-stone-dimension-list',
  imports: [TableLayout],
  templateUrl: './stone-dimension-list.html',
  styleUrl: './stone-dimension-list.scss',
})
export class StoneDimensionList extends ListBase<IStoneDimension> implements OnInit {
  private router = inject(Router);
  private pageTitleService = inject(PageTitleService);

  columns: TableColumn<IStoneDimension>[] = [
    {
      key: 'generatedKey',
      header: 'ID',
      type: 'text',
      cellClass: 'text-blue-600 font-medium cursor-pointer hover:text-blue-800',
    },
    {
      key: 'cutStyle',
      header: 'Cut Style',
      type: 'text',
      cellClass: 'text-gray-700',
    },
    {
      key: 'pricePerCt',
      header: 'Price per ct',
      type: 'text',
      cellClass: 'text-gray-700 font-medium',
    },
  ];

  override ngOnInit(): void {
    super.ngOnInit();
    this.pageTitleService.setTitle('Stone Dimension');
    this.loadItems();
  }

  openAddModal(): void {
    this.router.navigate([`/${APPRoutes.STONE_DIMENSION}/0`]);
  }

  openEditModal(id: number): void {
    this.router.navigate([`/${APPRoutes.STONE_DIMENSION}/${id}`]);
  }

  async deleteItem(id: number): Promise<void> {
    try {
      const res = await this.httpDeletePromise<IGenericResponse<null>>(
        this.apiRoutes.stone_dimension.DELETE(id),
      );
      if (res.status) {
        this.items.update((list) => list.filter((i) => i.id !== id));
        this.toastr.success('Stone dimension deleted successfully.');
      } else {
        this.toastr.error(res.message);
      }
    } catch {
      this.toastr.error('Failed to delete. Please try again.');
    }
  }

  async loadItems(): Promise<void> {
    this.isLoading.set(true);
    this.errorMessage.set(null);
    try {
      const res = await this.httpGetPromise<IGenericResponse<IStoneDimensionListResponse>>(
        this.apiRoutes.stone_dimension.GET_ALL,
      );
      if (res.status && res.data) {
        this.items.set(res.data.stones || []);
      } else {
        this.errorMessage.set(res.message);
      }
    } catch (error) {
      console.error('Error loading stone dimensions:', error);
      this.errorMessage.set('Failed to load stone dimensions. Please try again.');
    } finally {
      this.isLoading.set(false);
    }
  }
}
