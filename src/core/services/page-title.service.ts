import { Injectable, signal, WritableSignal } from '@angular/core';

export interface NavBarConfig {
  title: string;
  addButtonText?: string;
  onAdd?: () => void;
}

@Injectable({
  providedIn: 'root',
})
export class PageTitleService {
  public pageTitle: WritableSignal<string> = signal('Dashboard');
  public addButtonText: WritableSignal<string> = signal('');
  public onAddCallback: WritableSignal<(() => void) | null> = signal(null);

  setTitle(title: string): void {
    this.pageTitle.set(title);
  }

  getTitle(): string {
    return this.pageTitle();
  }

  /** Configure the nav-bar second row for the current page */
  setNavBar(config: NavBarConfig): void {
    this.pageTitle.set(config.title);
    this.addButtonText.set(config.addButtonText ?? '');
    this.onAddCallback.set(config.onAdd ?? null);
  }

  /** Clear nav-bar action row (e.g. on non-list pages) */
  clearNavBar(): void {
    this.addButtonText.set('');
    this.onAddCallback.set(null);
  }
}
