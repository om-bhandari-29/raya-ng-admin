import { Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Base } from '../../../core/base/base';
import { IGenericResponse } from '../../../core/response/genericResponse.interface';
import { IItemAttribute } from '../item-attribute.response';

@Component({
  selector: 'app-item-attribute-list',
  imports: [],
  templateUrl: './item-attribute-list.html',
  styleUrl: './item-attribute-list.scss',
})
export class ItemAttributeList extends Base implements OnInit {
  private router = inject(Router);

  attributes = signal<IItemAttribute[]>([]);
  isLoading = signal<boolean>(false);
  errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    this.loadAll();
  }

  openAdd(): void {
    this.router.navigate([this.appRoutes.ITEM_ATTRIBUTE, 'new']);
  }

  openEdit(id: number): void {
    this.router.navigate([this.appRoutes.ITEM_ATTRIBUTE, id]);
  }

  private async loadAll(): Promise<void> {
    this.isLoading.set(true);
    this.errorMessage.set(null);
    try {
      const response = await this.httpGetPromise<IGenericResponse<IItemAttribute[]>>(
        this.apiRoutes.item_attribute.GET_ALL
      );
      if (response.status) {
        this.attributes.set(response.data);
      } else {
        this.errorMessage.set(response.message);
      }
    } catch {
      this.errorMessage.set('Failed to load item attributes. Please try again.');
    } finally {
      this.isLoading.set(false);
    }
  }
}
