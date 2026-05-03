import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ListBase } from '../../../core/base/list-base';
import { IGenericResponse } from '../../../core/response/genericResponse.interface';
import { IStoneMaster } from '../stone-master.response';
import { StoneMasterType, StoneMasterLabel } from '../../../core/enum/stone-master.enum';
import { StoneMasterUpsert, StoneMasterDialogData } from '../stone-master-upsert/stone-master-upsert';
import { TableLayout } from '../../../core/component/table-layout/table-layout';
import { TableColumn } from '../../../core/models/table-column.interface';
import { signal } from '@angular/core';

@Component({
  selector: 'app-stone-master-list',
  imports: [TableLayout],
  templateUrl: './stone-master-list.html',
  styleUrl: './stone-master-list.scss',
})
export class StoneMasterList extends ListBase<IStoneMaster> implements OnInit {
  private dialog = inject(MatDialog);
  private route = inject(ActivatedRoute);

  stoneType = signal<StoneMasterType>(StoneMasterType.FAMILY);
  typeLabel = signal<string>(StoneMasterLabel.FAMILY);

  columns: TableColumn<IStoneMaster>[] = [
    {
      key: 'name',
      header: 'ID',
      width: '150px',
      slot: 'id',
    },
    {
      key: 'name',
      header: 'Name',
      type: 'text',
      cellClass: 'text-gray-800 font-medium'
    },
    {
      key: 'description',
      header: 'Description',
      type: 'text'
    },
    {
      key: 'is_published',
      header: 'Is Published',
      type: 'boolean'
    }
  ];

  ngOnInit(): void {
    const type = this.route.snapshot.data['stoneType'] as StoneMasterType;
    const label = this.route.snapshot.data['typeLabel'] as string;
    this.stoneType.set(type);
    this.typeLabel.set(label);
    this.loadItems();
  }

  openAddModal(): void { this.openModal(0); }
  openEditModal(id: number): void { this.openModal(id); }

  async deleteItem(id: number): Promise<void> {
    try {
      const res = await this.httpDeletePromise<IGenericResponse<null>>(this.routes.DELETE(id));
      if (res.status) {
        this.items.update(list => list.filter(i => i.id !== id));
        this.toastr.success(`${this.typeLabel()} deleted successfully.`);
      } else {
        this.toastr.error(res.message);
      }
    } catch {
      this.toastr.error('Failed to delete. Please try again.');
    }
  }

  private openModal(itemId: number): void {
    const data: StoneMasterDialogData = { itemId, type: this.stoneType(), typeLabel: this.typeLabel() };
    const dialogRef = this.dialog.open(StoneMasterUpsert, {
      width: '480px',
      disableClose: true,
      data,
    });
    dialogRef.afterClosed().subscribe((saved: boolean) => {
      if (saved) this.loadItems();
    });
  }

  private get routes() {
    const t = this.stoneType();
    return t === StoneMasterType.FAMILY ? this.apiRoutes.stone_family
         : t === StoneMasterType.CLARITY ? this.apiRoutes.stone_clarity
         : this.apiRoutes.stone_shape;
  }

  async loadItems(): Promise<void> {
    this.isLoading.set(true);
    this.errorMessage.set(null);
    try {
      const res = await this.httpGetPromise<IGenericResponse<IStoneMaster[]>>(this.routes.GET_ALL);
      if (res.status) {
        this.items.set(res.data);
      } else {
        this.errorMessage.set(res.message);
      }
    } catch {
      this.errorMessage.set(`Failed to load ${this.typeLabel()}. Please try again.`);
    } finally {
      this.isLoading.set(false);
    }
  }
}
