import { Component, OnInit, inject, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Base } from '../../../core/base/base';
import { IGenericResponse } from '../../../core/response/genericResponse.interface';
import { IGstHsnCode } from '../gst-hsn-code.response';
import { GstHsnCodeUpsert, GstHsnCodeDialogData } from '../gst-hsn-code-upsert/gst-hsn-code-upsert';

@Component({
  selector: 'app-gst-hsn-code-list',
  imports: [],
  templateUrl: './gst-hsn-code-list.html',
  styleUrl: './gst-hsn-code-list.scss',
})
export class GstHsnCodeList extends Base implements OnInit {
  private dialog = inject(MatDialog);

  items = signal<IGstHsnCode[]>([]);
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
    const data: GstHsnCodeDialogData = { itemId };
    const dialogRef = this.dialog.open(GstHsnCodeUpsert, {
      width: '520px',
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
      const response = await this.httpGetPromise<IGenericResponse<IGstHsnCode[]>>(
        this.apiRoutes.gst_hsn_code.GET_ALL
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
