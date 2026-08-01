import { Component, OnInit, WritableSignal, inject, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ListBase } from '../../core/base/list-base';
import { RMetal, RMetalPurity } from '../../core/response/metal-purity.response';
import { IGenericListResponse } from '../../core/response/genericResponse.interface';
import { MetalMasterType } from '../../core/enum/metal-master.enum';
import { CommonModule } from '@angular/common';
import { MetalPurityDialogData } from './metal-master-upsert/metal-master-upsert.model';
import { MetalPurityUpsert } from './metal-master-upsert/metal-purity-upsert';
import { MetalType, metalTypesArray } from '../../core/enum/metal-type.enum';

@Component({
  selector: 'app-metal-master',
  imports: [CommonModule],
  templateUrl: './metal-master.html',
  styleUrl: './metal-master.scss',
})
export class MetalMaster extends ListBase<RMetal> implements OnInit {
  private dialog = inject(MatDialog);

  public selectedMetal: WritableSignal<MetalType> = signal<MetalType>(MetalType.GOLD);
  public metals: WritableSignal<RMetal[]> = signal<RMetal[]>([]);
  public metalPurityList: WritableSignal<RMetalPurity[]> = signal<RMetalPurity[]>([]);

  override ngOnInit(): void {
    super.ngOnInit();
    this.pageTitleService.setTitle('Metals');
    this.breadcrumb.set([{ label: 'Metals' }]);
    // this.loadItems();
    this.setHeaderConfig('Metals', '');
    this.metals.update(() => metalTypesArray);
    this.loadMetalPurity();
  }

  public onUpsertMetalClick(id: number = 0): void {
    this.openModal(MetalMasterType.METAL, id);
  }

  public onUpsertPurityClick(id: number = 0): void {
    this.openModal(MetalMasterType.PURITY, id);
  }

  private openModal(metalMasterType: MetalMasterType, itemId: number): void {
    const data: MetalPurityDialogData = {
      itemId,
      metalMasterType,
      metalType: this.selectedMetal(),
    };

    const dialogRef = this.dialog.open(MetalPurityUpsert, {
      width: '480px',
      disableClose: true,
      data,
    });

    dialogRef.afterClosed().subscribe((saved: boolean) => {
      if (saved) {
        if (metalMasterType === MetalMasterType.METAL) {
          this.loadItems();
        } else {
          this.loadMetalPurity();
        }
      }
    });
  }

  public updateSelectedMetal(metalId: number) {
    this.selectedMetal.update(() => metalId);
    this.loadMetalPurity();
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

      const res = await this.httpGetPromise<IGenericListResponse<RMetal>>(
        this.apiRoutes.Metal_Master.GET_ALL,
        true,
        queryParams,
      );

      if (res.status && res.data) {
        this.metals.update(() => res.data.items || []);
        // this.selectedMetal.update(() => (res.data.items.length > 0 ? res.data.items[0].id : null));
        this.loadMetalPurity();
        if (res.meta) {
          this.meta.set(res.meta);
        }
      } else {
        this.errorMessage.set(res.message);
        this.metals.update(() => []);
      }
    } catch (error) {
      console.error('Error loading metal purities:', error);
      this.errorMessage.set('Failed to load metal purities. Please try again.');
    } finally {
      this.isLoading.set(false);
    }
  }

  private loadMetalPurity(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    const payload: Record<string, string | number> = {
      metal_type: this.selectedMetal() ?? 0,
      page: this.meta().page,
      limit: this.meta().limit,
      search: this.searchTerm() ?? undefined,
    };

    this.httpGetPromise<IGenericListResponse<RMetalPurity>>(
      this.apiRoutes.Metal_Purity.GET_ALL,
      true,
      payload,
    )
      .then((res) => {
        if (res.status && res.data) {
          this.metalPurityList.update(() => res.data.items || []);
          if (res.meta) {
            this.meta.set(res.meta);
          }
        } else {
          this.errorMessage.set(res.message);
          this.metalPurityList.update(() => []);
        }
      })
      .catch((error) => {
        console.error('Error loading metal purities:', error);
        this.metalPurityList.update(() => []);
      })
      .finally(() => {
        this.isLoading.set(false);
      });
  }
}
