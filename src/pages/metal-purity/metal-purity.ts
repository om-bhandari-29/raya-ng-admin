import { Component, OnInit, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ListBase } from '../../core/base/list-base';
import { RMetalPurity } from './metal-purity.response';
import { IGenericListResponse } from '../../core/response/genericResponse.interface';
import { TableColumn } from '../../core/models/table-column.interface';
import { TableLayout } from '../../core/component/table-layout/table-layout';
import {
  MetalPurityUpsert,
  MetalPurityDialogData,
} from './metal-purity-upsert/metal-purity-upsert';
import { ActivatedRoute, Router } from '@angular/router';
import { MetalMasterType } from '../../core/enum/metal-master.enum';

@Component({
  selector: 'app-metal-purity',
  imports: [TableLayout],
  templateUrl: './metal-purity.html',
  styleUrl: './metal-purity.scss',
})
export class MetalPurity extends ListBase<RMetalPurity> implements OnInit {
  private dialog = inject(MatDialog);
  private _activatedRoute = inject(ActivatedRoute);

  private metalMasterType = this._activatedRoute.snapshot.data['MetalMasterType'];
  private metalMasterLabel = this._activatedRoute.snapshot.data['MetalMasterLabel'];

  public addBtnTitle = this.metalMasterType === MetalMasterType.PURITY ? 'Add Metal Purity' : 'Add Metal Color';

  columns: TableColumn<RMetalPurity>[] = [
    {
      key: 'id',
      header: 'ID',
      type: 'text',
      width: '10%',
      cellClass: 'text-gray-700',
    },
    {
      key: 'name',
      header: 'Name',
      type: 'text',
      width: '40%',
      ellipsis: true,
      cellClass: 'text-blue-600 font-medium cursor-pointer hover:text-blue-800',
    },
    {
      key: 'code',
      header: 'Code',
      type: 'text',
      width: '30%',
      cellClass: 'text-gray-700',
    },
  ];

  override ngOnInit(): void {
    super.ngOnInit();
    this.pageTitleService.setTitle(this.metalMasterLabel);
    this.breadcrumb.set([{ label: this.metalMasterLabel }]);
    this.loadItems();
    this.setHeaderConfig(this.metalMasterLabel, '');
  }

  openAddModal(): void {
    this.openModal(0);
  }

  openEditModal(id: number): void {
    this.openModal(id);
  }

  private openModal(itemId: number): void {
    const data: MetalPurityDialogData = { itemId, metalMasterType: this.metalMasterType };

    const dialogRef = this.dialog.open(MetalPurityUpsert, {
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
      const queryParams: Record<string, string | number | boolean> = {
        page: this.meta().page,
        limit: this.meta().limit,
      };

      if (this.searchTerm()) {
        queryParams['search'] = this.searchTerm();
      }

      const res = await this.httpGetPromise<IGenericListResponse<RMetalPurity>>(
        this.metalMasterType === MetalMasterType.PURITY
          ? this.apiRoutes.Metal_Purity.GET_ALL
          : this.apiRoutes.Metal_Color.GET_ALL,
        true,
        queryParams,
      );

      if (res.status && res.data) {
        this.items.set(res.data.items || []);
        if (res.meta) {
          this.meta.set(res.meta);
        }
      } else {
        this.errorMessage.set(res.message);
      }
    } catch (error) {
      console.error('Error loading metal purities:', error);
      this.errorMessage.set('Failed to load metal purities. Please try again.');
    } finally {
      this.isLoading.set(false);
    }
  }
}
