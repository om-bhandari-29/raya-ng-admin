import { Injectable, signal, WritableSignal } from '@angular/core';
import { SidebarMode } from '../../enum/sidebar-mode.enum';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  public isCollapsed: WritableSignal<boolean> = signal(false);
  public mode: WritableSignal<SidebarMode> = signal(SidebarMode.NAV);

  setMode(mode: SidebarMode): void {
    this.mode.set(mode);
  }

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
