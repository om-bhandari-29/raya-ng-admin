import { Component, OnInit, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ListBase } from '../../../core/base/list-base';
import { IGenericResponse } from '../../../core/response/genericResponse.interface';
import { IGstHsnCode } from '../gst-hsn-code.response';
import { GstHsnCodeUpsert, GstHsnCodeDialogData } from '../gst-hsn-code-upsert/gst-hsn-code-upsert';
import { TableLayout } from '../../../core/component/table-layout/table-layout';
import { TableColumn } from '../../../core/models/table-column.interface';

@Component({
  selector: 'app-gst-hsn-code-list',
  imports: [TableLayout],
  templateUrl: './gst-hsn-code-list.html',
  styleUrl: './gst-hsn-code-list.scss',
})
export class GstHsnCodeList extends ListBase<IGstHsnCode> implements OnInit {
  private dialog = inject(MatDialog);

  columns: TableColumn<IGstHsnCode>[] = [
    {
      key: 'hsn_code',
      header: 'ID',
      width: '120px',
      slot: 'id',
    },
    {
      key: 'hsn_code',
      header: 'HSN Code',
      type: 'text',
      cellClass: 'text-gray-800 font-medium',
    },
    {
      key: 'description',
      header: 'Description',
      type: 'text',
    },
    {
      key: 'gst_rate',
      header: 'GST Rate (%)',
      type: 'number',
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
  }

  openAddModal(): void {
    this.openModal(0);
  }

  openEditModal(id: number): void {
    this.openModal(id);
  }

  private openModal(itemId: number): void {
    const data: GstHsnCodeDialogData = { itemId };
    const dialogRef = this.dialog.open(GstHsnCodeUpsert, {
      width: '520px',
      disableClose: true,
      data,
    });
    dialogRef.afterClosed().subscribe((saved: boolean) => {
      if (saved) this.loadItems();
    });
  }

  async loadItems(): Promise<void> {
    this.isLoading.set(true);
    this.errorMessage.set(null);
    try {
      const response = await this.httpGetPromise<IGenericResponse<IGstHsnCode[]>>(
        this.apiRoutes.gst_hsn_code.GET_ALL,
      );
      if (response.status) {
        this.items.set(response.data);
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
