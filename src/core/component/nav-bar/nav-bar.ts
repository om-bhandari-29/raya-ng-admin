import { Component, inject } from '@angular/core';
import { BreadcrumbService } from '../../services/breadcrumb.service';
import { PageTitleService } from '../../services/page-title.service';

@Component({
  selector: 'app-nav-bar',
  imports: [],
  templateUrl: './nav-bar.html',
  styleUrl: './nav-bar.scss',
})
export class NavBar {
  public breadcrumbService = inject(BreadcrumbService);
  public pageTitleService = inject(PageTitleService);

  handleAdd(): void {
    const cb = this.pageTitleService.onAddCallback();
    if (cb) cb();
  }
}
