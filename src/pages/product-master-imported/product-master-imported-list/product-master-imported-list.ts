import { Component, OnInit, inject, computed } from '@angular/core';
import { ListBase } from '../../../core/base/list-base';
import { IProductMasterImported, IProductMasterImportedResponse } from '../product-master-imported.response';
import { TableLayout } from '../../../core/component/table-layout/table-layout';
import { TableColumn } from '../../../core/models/table-column.interface';
import { PageTitleService } from '../../../core/services/page-title.service';
import { BreadcrumbService } from '../../../core/services/breadcrumb.service';

@Component({
  selector: 'app-product-master-imported-list',
  imports: [TableLayout],
  templateUrl: './product-master-imported-list.html',
  styleUrl: './product-master-imported-list.scss',
})
export class ProductMasterImportedList extends ListBase<IProductMasterImported> implements OnInit {
  private pageTitleService = inject(PageTitleService);
  private breadcrumb = inject(BreadcrumbService);

  columns: TableColumn<IProductMasterImported>[] = [
    {
      key: 'id',
      header: 'ID',
      type: 'text',
      width: '10%',
      cellClass: 'text-gray-700 font-medium',
    },
    {
      key: 'design_slug',
      header: 'Design Slug',
      type: 'text',
      width: '40%',
      cellClass: 'text-blue-600 font-medium',
    },
    {
      key: 'variant_name',
      header: 'Variant Name',
      type: 'text',
      width: '30%',
      cellClass: 'text-gray-700',
    },
    {
      key: 'target_gender',
      header: 'Target Gender',
      type: 'text',
      width: '20%',
      cellClass: 'text-gray-700',
    },
  ];

  filteredItems = computed(() => {
    const term = this.searchTerm().toLowerCase();
    if (!term) return this.items();
    return this.items().filter(item =>
      item.design_slug.toLowerCase().includes(term) ||
      item.variant_name.toLowerCase().includes(term) ||
      item.target_gender.toLowerCase().includes(term)
    );
  });

  override ngOnInit(): void {
    super.ngOnInit();
    this.pageTitleService.setTitle('Product Master Imported');
    this.breadcrumb.set([{ label: 'Product Master Imported' }]);
    this.loadItems();
    this.setHeaderConfig('Product Master Imported', '');
  }

  async loadItems(): Promise<void> {
    this.isLoading.set(true);
    this.errorMessage.set(null);
    try {
      const res = await this.httpGetPromise<IProductMasterImportedResponse>(
        this.apiRoutes.products_import.GET_BlUEPRINT,
      );
      if (res.success && res.data) {
        this.items.set(res.data);
      } else {
        this.errorMessage.set('Failed to load data.');
      }
    } catch (error) {
      console.error('Error loading product master imported:', error);
      this.errorMessage.set('Failed to load product master imported. Please try again.');
    } finally {
      this.isLoading.set(false);
    }
  }

  override onSearchChange(term: string): void {
    this.searchTerm.set(term);
  }
}
