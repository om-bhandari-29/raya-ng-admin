import { Component, signal, WritableSignal, effect, inject } from '@angular/core';
import { IMenuSideBarItem, MenuItems } from './sidebar.model';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SidebarService } from './sidebar.service';

@Component({
  selector: 'app-side-bar',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './side-bar.html',
  styleUrl: './side-bar.scss',
})
export class SideBar {
  private sidebarService = inject(SidebarService);
  public menuItems: WritableSignal<IMenuSideBarItem[]> = signal(MenuItems);
  public isCollapsed: WritableSignal<boolean>;
  public sectionCollapsed: WritableSignal<boolean> = signal(false);

  constructor() {
    this.isCollapsed = this.sidebarService.isCollapsed;
  }

  toggleSubmenu(item: IMenuSideBarItem): void {
    if (item.child && item.child.length > 0) {
      item.expanded = !item.expanded;
      this.menuItems.set([...this.menuItems()]);
    }
  }

  toggleSection(): void {
    this.sectionCollapsed.set(!this.sectionCollapsed());
  }
}
