import { Component, signal, WritableSignal, inject, OnInit, OnDestroy } from '@angular/core';
import { IMenuSideBarItem, MenuItems } from './sidebar.model';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SidebarService } from './sidebar.service';
import { BreadcrumbService } from '../../services/breadcrumb.service';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-side-bar',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './side-bar.html',
  styleUrl: './side-bar.scss',
})
export class SideBar implements OnInit, OnDestroy {
  private sidebarService = inject(SidebarService);
  private breadcrumbService = inject(BreadcrumbService);
  private router = inject(Router);
  private sub!: Subscription;

  public menuItems: WritableSignal<IMenuSideBarItem[]> = signal(MenuItems);
  public isCollapsed: WritableSignal<boolean>;
  public sectionCollapsed: WritableSignal<boolean> = signal(false);

  constructor() {
    this.isCollapsed = this.sidebarService.isCollapsed;
  }

  ngOnInit(): void {
    this.updateBreadcrumb(this.router.url);
    this.sub = this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(e => this.updateBreadcrumb((e as NavigationEnd).urlAfterRedirects));
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  private updateBreadcrumb(url: string): void {
    const allItems = this.menuItems().flatMap(i => i.child?.length ? i.child : [i]);
    const matched = allItems.find(i => url.startsWith('/' + i.route));
    if (matched) this.breadcrumbService.set([{ label: matched.name }]);
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
