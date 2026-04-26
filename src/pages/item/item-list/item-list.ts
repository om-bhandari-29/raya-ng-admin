import { Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Base } from '../../../core/base/base';
import { IGenericResponse } from '../../../core/response/genericResponse.interface';
import { IItem } from '../item.response';

@Component({
  selector: 'app-item-list',
  imports: [],
  templateUrl: './item-list.html',
  styleUrl: './item-list.scss',
})
export class ItemList extends Base implements OnInit {
  private router = inject(Router);

  items = signal<IItem[]>([]);
  isLoading = signal<boolean>(false);
  errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    this.loadAll();
  }

  openAdd(): void {
    this.router.navigate([this.appRoutes.ITEM, 'new']);
  }

  openEdit(id: number): void {
    this.router.navigate([this.appRoutes.ITEM, id]);
  }

  async deleteItem(id: number): Promise<void> {
    try {
      const res = await this.httpDeletePromise<IGenericResponse<null>>(
        this.apiRoutes.item.DELETE(id)
      );
      if (res.status) {
        this.items.update(list => list.filter(i => i.id !== id));
        this.toastr.success('Item deleted successfully.');
      } else {
        this.toastr.error(res.message);
      }
    } catch {
      this.toastr.error('Failed to delete item. Please try again.');
    }
  }

  private async loadAll(): Promise<void> {
    this.isLoading.set(true);
    this.errorMessage.set(null);
    try {
      const response = await this.httpGetPromise<IGenericResponse<IItem[]>>(
        this.apiRoutes.item.GET_ALL
      );
      if (response.status) {
        this.items.set(response.data);
      } else {
        this.errorMessage.set(response.message);
      }
    } catch {
      this.errorMessage.set('Failed to load items. Please try again.');
    } finally {
      this.isLoading.set(false);
    }
  }
}
