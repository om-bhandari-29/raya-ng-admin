import { Component, inject } from '@angular/core';
import { SidebarService } from '../side-bar/sidebar.service';

@Component({
  selector: 'app-action-header-component',
  imports: [],
  templateUrl: './action-header-component.html',
  styleUrl: './action-header-component.scss',
})
export class ActionHeaderComponent {
  private sidebarService = inject(SidebarService);

  toggleSidebar(): void {
    this.sidebarService.toggleSidebar();
  }
}
