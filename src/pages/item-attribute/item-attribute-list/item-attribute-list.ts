import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ListBase } from '../../../core/base/list-base';
import { IGenericResponse } from '../../../core/response/genericResponse.interface';
import { IItemAttribute } from '../item-attribute.response';
import { TableLayout } from '../../../core/component/table-layout/table-layout';
import { TableColumn } from '../../../core/models/table-column.interface';

@Component({
  selector: 'app-item-attribute-list',
  imports: [TableLayout],
  templateUrl: './item-attribute-list.html',
  styleUrl: './item-attribute-list.scss',
})
export class ItemAttributeList extends ListBase<IItemAttribute> implements OnInit {
  private router = inject(Router);

  columns: TableColumn<IItemAttribute>[] = [
    {
      key: 'attribute_name',
      header: 'ID',
      width: '150px',
      slot: 'id',
    },
    {
      key: 'attribute_name',
      header: 'Attribute Name',
      type: 'text',
      cellClass: 'text-gray-800 font-medium'
    },
    {
      key: 'numeric_values',
      header: 'Type',
      type: 'badge',
      badgeConfig: {
        trueLabel: 'Numeric',
        falseLabel: 'Text',
        trueClass: 'bg-blue-100 text-blue-700',
        falseClass: 'bg-purple-100 text-purple-700'
      }
    },
    {
      key: 'values',
      header: 'Values',
      type: 'custom',
      format: (values) => values?.length ? `${values.length} values` : 'No values'
    },
    {
      key: 'status',
      header: 'Is Active',
      type: 'boolean'
    }
  ];

  ngOnInit(): void {
    this.loadItems();
  }

  openAdd(): void {
    this.router.navigate([this.appRoutes.ITEM_ATTRIBUTE, 'new']);
  }

  openEdit(id: number): void {
    this.router.navigate([this.appRoutes.ITEM_ATTRIBUTE, id]);
  }

  async loadItems(): Promise<void> {
    this.isLoading.set(true);
    this.errorMessage.set(null);
    try {
      const response = await this.httpGetPromise<IGenericResponse<IItemAttribute[]>>(
        this.apiRoutes.item_attribute.GET_ALL
      );
      if (response.status) {
        this.items.set(response.data);
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
