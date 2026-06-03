import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ListBase } from '../../../core/base/list-base';
import { IGenericResponse } from '../../../core/response/genericResponse.interface';
import { IGstHsnCode } from '../gst-hsn-code.response';
import { TableLayout } from '../../../core/component/table-layout/table-layout';
import { TableColumn } from '../../../core/models/table-column.interface';

@Component({
  selector: 'app-gst-hsn-code-list',
  imports: [TableLayout],
  templateUrl: './gst-hsn-code-list.html',
  styleUrl: './gst-hsn-code-list.scss',
})
export class GstHsnCodeList extends ListBase<IGstHsnCode> implements OnInit {
  private router = inject(Router);

  columns: TableColumn<IGstHsnCode>[] = [
    {
      key: 'name',
      header: 'ID',
      width: '180px',
      type: 'text',
      cellClass: 'font-medium',
    },
    {
      key: 'hsn_code',
      header: 'HSN Code',
      type: 'text',
      width: '180px',
    },
    {
      key: 'description',
      header: 'Description',
      type: 'text',
      width: '300px',
      ellipsis: true,
    },
  ];

  override ngOnInit(): void {
    super.ngOnInit();
    this.loadItems();

    this.setHeaderConfig('GST HSN Code', 'Add GST HSN Code');
  }

  openAddModal(): void {
    this.router.navigate([this.appRoutes.GST_HSN_CODE_UPSERT], { queryParams: { id: 0 } });
  }

  openEditModal(id: number): void {
    this.router.navigate([this.appRoutes.GST_HSN_CODE_UPSERT], { queryParams: { id } });
  }

  public override onActionButtonClick(): void {
    this.router.navigate([this.appRoutes.GST_HSN_CODE_UPSERT], { queryParams: { id: 0 } });
  }

  async loadItems(): Promise<void> {
    this.isLoading.set(true);
    this.errorMessage.set(null);
    try {
      const response = await this.httpGetPromise<IGenericResponse<IGstHsnCode[]>>(
        this.apiRoutes.gst_hsn_code.GET_ALL(this.meta().page, this.meta().limit),
      );
      if (response.status) {
        this.items.set(response.data);
        if (response.meta) {
          // this.totalItems.set(response.meta.total);
          this.meta.set(response.meta);
          // this.totalPages.set(response.meta.totalPages);
        }
      } else {
        this.errorMessage.set(response.message);
      }
    } catch {
      this.errorMessage.set('Failed to load GST HSN codes. Please try again.');
    } finally {
      this.isLoading.set(false);
    }
  }
}
