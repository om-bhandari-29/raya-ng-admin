import { Component, inject } from '@angular/core';
import { SidebarService } from '../side-bar/sidebar.service';
import { PageTitleService } from '../../services/page-title.service';

@Component({
  selector: 'app-nav-bar',
  imports: [],
  templateUrl: './nav-bar.html',
  styleUrl: './nav-bar.scss',
})
export class NavBar {
  private sidebarService = inject(SidebarService);
  public pageTitleService = inject(PageTitleService);

  toggleSidebar(): void {
    this.sidebarService.toggleSidebar();
  }
}
