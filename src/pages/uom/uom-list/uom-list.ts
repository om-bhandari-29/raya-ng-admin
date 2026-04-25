import { Component, OnInit, inject, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Base } from '../../../core/base/base';
import { IGenericResponse } from '../../../core/response/genericResponse.interface';
import { IUom } from '../uom.response';
import { UomUpsert, UomDialogData } from '../uom-upsert/uom-upsert';

@Component({
  selector: 'app-uom-list',
  imports: [],
  templateUrl: './uom-list.html',
  styleUrl: './uom-list.scss',
})
export class UomList extends Base implements OnInit {
  private dialog = inject(MatDialog);

  items = signal<IUom[]>([]);
  isLoading = signal<boolean>(false);
  errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    this.loadAll();
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
      if (saved) this.loadAll();
    });
  }

  private async loadAll(): Promise<void> {
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
