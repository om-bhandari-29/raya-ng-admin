import { Component, OnInit, inject, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Base } from '../../../core/base/base';
import { IGenericResponse } from '../../../core/response/genericResponse.interface';
import { IGroupItem } from '../group-item.response';
import { GroupItemUpsert, GroupItemDialogData } from '../group-item-upsert/group-item-upsert';

@Component({
  selector: 'app-group-item-list',
  imports: [],
  templateUrl: './group-item-list.html',
  styleUrl: './group-item-list.scss',
})
export class GroupItemList extends Base implements OnInit {
  private dialog = inject(MatDialog);

  groupItems = signal<IGroupItem[]>([]);
  isLoading = signal<boolean>(false);
  errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    this.getAllGroupItems();
  }

  openAddModal(): void {
    this.openModal(0);
  }

  openEditModal(id: number): void {
    this.openModal(id);
  }

  private openModal(itemId: number): void {
    const data: GroupItemDialogData = { itemId };

    const dialogRef = this.dialog.open(GroupItemUpsert, {
      width: '480px',
      disableClose: true,
      data,
    });

    dialogRef.afterClosed().subscribe((saved: boolean) => {
      if (saved) {
        this.getAllGroupItems();
      }
    });
  }

  private async getAllGroupItems(): Promise<void> {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    try {
      const response = await this.httpGetPromise<IGenericResponse<IGroupItem[]>>(
        this.apiRoutes.item_group.GET_ALL
      );

      if (response.status) {
        this.groupItems.set(response.data);
      } else {
        this.errorMessage.set(response.message);
      }
    } catch {
      this.errorMessage.set('Failed to load item groups. Please try again.');
    } finally {
      this.isLoading.set(false);
    }
  }
}
