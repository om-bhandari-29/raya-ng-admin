import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { SidebarService } from '../side-bar/sidebar.service';
import { ActionService } from '../../services/action.service';

@Component({
  selector: 'app-action-header-component',
  imports: [AsyncPipe],
  templateUrl: './action-header-component.html',
  styleUrl: './action-header-component.scss',
})
export class ActionHeaderComponent {
  private sidebarService = inject(SidebarService);
  public actionService = inject(ActionService);

  toggleSidebar(): void {
    this.sidebarService.toggleSidebar();
  }

  onButtonClick(): void {
    this.actionService.emitButtonClick();
  }
}
