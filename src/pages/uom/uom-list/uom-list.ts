import { Component, OnInit, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { HttpErrorResponse } from '@angular/common/http';
import { ListBase } from '../../../core/base/list-base';
import { IGenericResponse } from '../../../core/response/genericResponse.interface';
import { IUom } from '../uom.response';
import { UomUpsert, UomDialogData } from '../uom-upsert/uom-upsert';
import { TableLayout, TableSlot } from '../../../core/component/table-layout/table-layout';
import { TableColumn } from '../../../core/models/table-column.interface';

@Component({
  selector: 'app-uom-list',
  imports: [TableLayout, TableSlot],
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
      slot: 'id',
    },
    {
      key: 'must_be_whole_number',
      header: 'Must be Whole Number',
      type: 'boolean',
    },
    {
      key: 'enabled',
      header: 'Status',
      type: 'badge',
      badgeConfig: {
        trueLabel: 'Enabled',
        falseLabel: 'Disabled',
        trueClass: 'bg-green-100 text-green-700',
        falseClass: 'bg-red-100 text-red-600',
      },
    },
  ];

  override ngOnInit(): void {
    super.ngOnInit();
    this.loadItems();
    this.setHeaderConfig('UOM', 'Add UOM');
  }

  protected override onActionButtonClick(): void {
    this.openAddModal();
  }

  openAddModal(): void {
    this.openModal('');
  }

  openEditModal(name: string): void {
    this.openModal(name);
  }

  private openModal(itemName: string): void {
    const data: UomDialogData = { itemName };
    const dialogRef = this.dialog.open(UomUpsert, {
      width: '480px',
      disableClose: true,
      data,
    });
    dialogRef.afterClosed().subscribe((saved: boolean) => {
      if (saved) this.loadItems();
    });
  }

  async delete(name: string): Promise<void> {
    if (!confirm('Are you sure you want to delete this UOM?')) return;

    try {
      const response = await this.httpDeletePromise<IGenericResponse<null>>(
        this.apiRoutes.uom.DELETE(name),
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
      const response = await this.httpGetPromise<IGenericResponse<IUom[]>>(
        this.apiRoutes.uom.GET_ALL,
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
