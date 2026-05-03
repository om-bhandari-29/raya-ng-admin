import { Component, computed, Signal, inject } from '@angular/core';
import { NavBar } from "../nav-bar/nav-bar";
import { SideBar } from "../side-bar/side-bar";
import { RouterOutlet } from "@angular/router";
import { SidebarService } from '../side-bar/sidebar.service';

@Component({
  selector: 'app-layout',
  imports: [NavBar, SideBar, RouterOutlet],
  templateUrl: './layout.html',
  styleUrl: './layout.scss',
})
export class Layout {
  private sidebarService = inject(SidebarService);
  public mainContentClass: Signal<string>;

  constructor() {
    this.mainContentClass = computed(() => 
      this.sidebarService.isCollapsed() 
        ? 'left-14' 
        : 'left-52'
    );
  }
}
