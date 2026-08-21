import { Injectable, signal } from '@angular/core';

export interface Breadcrumb {
  label: string;
  url?: string;
}

@Injectable({ providedIn: 'root' })
export class BreadcrumbService {
  readonly breadcrumbs = signal<Breadcrumb[]>([]);

  set(crumbs: Breadcrumb[]): void {
    this.breadcrumbs.set(crumbs);
  }

  push(crumb: Breadcrumb): void {
    this.breadcrumbs.update(c => [...c, crumb]);
  }

  pop(): void {
    this.breadcrumbs.update(c => c.slice(0, -1));
  }

  clear(): void {
    this.breadcrumbs.set([]);
  }
}
