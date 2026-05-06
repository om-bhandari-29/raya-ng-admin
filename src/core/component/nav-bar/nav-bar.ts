import { Component, inject } from '@angular/core';
import { SidebarService } from '../side-bar/sidebar.service';
import { BreadcrumbService } from '../../services/breadcrumb.service';

@Component({
  selector: 'app-nav-bar',
  imports: [],
  templateUrl: './nav-bar.html',
  styleUrl: './nav-bar.scss',
})
export class NavBar {
  private sidebarService = inject(SidebarService);
  public breadcrumbService = inject(BreadcrumbService);

  toggleSidebar(): void {
    this.sidebarService.toggleSidebar();
  }
}
