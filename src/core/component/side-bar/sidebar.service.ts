import { Injectable, signal, WritableSignal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  public isCollapsed: WritableSignal<boolean> = signal(false);

  toggleSidebar(): void {
    this.isCollapsed.set(!this.isCollapsed());
  }

  collapseSidebar(): void {
    this.isCollapsed.set(true);
  }

  expandSidebar(): void {
    this.isCollapsed.set(false);
  }
}
