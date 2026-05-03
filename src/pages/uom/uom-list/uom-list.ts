import { Component, OnInit, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ListBase } from '../../../core/base/list-base';
import { IGenericResponse } from '../../../core/response/genericResponse.interface';
import { IUom } from '../uom.response';
import { UomUpsert, UomDialogData } from '../uom-upsert/uom-upsert';
import { TableLayout } from '../../../core/component/table-layout/table-layout';
import { TableColumn } from '../../../core/models/table-column.interface';

@Component({
  selector: 'app-uom-list',
  imports: [TableLayout],
  templateUrl: './uom-list.html',
  styleUrl: './uom-list.scss',
})
export class UomList extends ListBase<IUom> implements OnInit {
  private dialog = inject(MatDialog);

  // Define table columns
  columns: TableColumn<IUom>[] = [
    {
      key: 'name',
      header: 'ID',
      width: '120px',
      slot: 'id',
    },
    {
      key: 'name',
      header: 'UOM Name',
      type: 'text',
      cellClass: 'text-gray-800 font-medium'
    },
    {
      key: 'description',
      header: 'Description',
      type: 'text'
    },
    {
      key: 'is_active',
      header: 'Is Active',
      type: 'boolean'
    }
  ];

  ngOnInit(): void {
    this.loadItems();
  }

  openAddModal(): void {
    this.openModal(0);
  }

  openEditModal(id: number): void {
    this.openModal(id);
  }

  private openModal(itemId: number): void {
    const data: UomDialogData = { itemId };
    const dialogRef = this.dialog.open(UomUpsert, {
      width: '480px',
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
      const response = await this.httpGetPromise<IGenericResponse<IUom[]>>(
        this.apiRoutes.uom.GET_ALL
      );
      if (response.status) {
        this.items.set(response.data);
      } else {
        this.errorMessage.set(response.message);
      }
    } catch {
      this.errorMessage.set('Failed to load UOMs. Please try again.');
    } finally {
      this.isLoading.set(false);
    }
  }
}
