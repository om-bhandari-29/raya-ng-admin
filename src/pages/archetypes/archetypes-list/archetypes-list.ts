import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ListBase } from '../../../core/base/list-base';
import { IGenericResponse } from '../../../core/response/genericResponse.interface';
import { IArchetype, IArchetypeListResponse } from '../archetypes.response';
import { TableLayout } from '../../../core/component/table-layout/table-layout';
import { TableColumn } from '../../../core/models/table-column.interface';
import { PageTitleService } from '../../../core/services/page-title.service';
import { BreadcrumbService } from '../../../core/services/breadcrumb.service';

@Component({
  selector: 'app-archetypes-list',
  imports: [TableLayout],
  templateUrl: './archetypes-list.html',
  styleUrl: './archetypes-list.scss',
})
export class ArchetypesList extends ListBase<IArchetype> implements OnInit {
  private pageTitleService = inject(PageTitleService);
  private breadcrumb = inject(BreadcrumbService);
  private router = inject(Router);

  columns: TableColumn<IArchetype>[] = [
    {
      key: 'id',
      header: 'ID',
      type: 'text',
      width: '10%',
      cellClass: 'text-gray-700',
    },
    {
      key: 'design_slug',
      header: 'Design Slug',
      type: 'text',
      width: '40%',
      ellipsis: true,
      cellClass: 'text-blue-600 font-medium cursor-pointer hover:text-blue-800',
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
      header: 'Gender',
      type: 'text',
      width: '20%',
      cellClass: 'text-gray-700',
    },
  ];

  override ngOnInit(): void {
    super.ngOnInit();
    this.pageTitleService.setTitle('Archetypes');
    this.breadcrumb.set([{ label: 'Archetypes' }]);
    this.loadItems();
    this.setHeaderConfig('Archetypes', ''); // Empty button title as it's list view only
  }

  openDetail(design_slug: string, route: string): void {
    this.router.navigate([`/${route}`, design_slug]);
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
      
      const res = await this.httpGetPromise<IGenericResponse<IArchetypeListResponse>>(
        this.apiRoutes.archetypes.GET_ALL,
        true,
        queryParams
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
      console.error('Error loading archetypes:', error);
      this.errorMessage.set('Failed to load archetypes. Please try again.');
    } finally {
      this.isLoading.set(false);
    }
  }
}
