import { Injectable, computed, signal } from '@angular/core';

@Injectable()
export class LoadingService {
  private _loadingCount = signal(0);

  isLoading = computed(() => this._loadingCount() > 0);

  startLoading() {
    this._loadingCount.update((count) => count + 1);
  }

  completeLoading() {
    this._loadingCount.update((count) => (count === 0 ? 0 : count - 1));
  }
}
