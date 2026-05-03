import { signal, WritableSignal } from '@angular/core';
import { Base } from './base';

export abstract class ListBase<T> extends Base {
  items = signal<T[]>([]);
  isLoading = signal<boolean>(false);
  errorMessage = signal<string | null>(null);

  abstract loadItems(): Promise<void>;

  getTimeAgo(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    const diffInMonths = Math.floor(diffInDays / 30);
    const diffInYears = Math.floor(diffInDays / 365);

    if (diffInMinutes < 1) {
      return 'just now';
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes}m`;
    } else if (diffInHours < 24) {
      return `${diffInHours}h`;
    } else if (diffInDays < 30) {
      return `${diffInDays}d`;
    } else if (diffInMonths < 12) {
      return `${diffInMonths}M`;
    } else {
      return `${diffInYears}y`;
    }
  }
}
