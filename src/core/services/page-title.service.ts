import { Injectable, signal, WritableSignal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PageTitleService {
  public pageTitle: WritableSignal<string> = signal('Dashboard');

  setTitle(title: string): void {
    this.pageTitle.set(title);
  }

  getTitle(): string {
    return this.pageTitle();
  }
}
