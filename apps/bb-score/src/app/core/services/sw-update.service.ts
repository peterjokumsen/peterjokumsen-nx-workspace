import { Injectable, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SwUpdate } from '@angular/service-worker';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SwUpdateService {
  private _window = inject(Window, { optional: true }) ?? window;
  private _swUpdate = inject(SwUpdate);
  private _updateAvailable = new BehaviorSubject<boolean>(false);

  updateAvailable$ = this._updateAvailable.asObservable();

  constructor() {
    if (!this._swUpdate.isEnabled) return;

    this._swUpdate.versionUpdates
      .pipe(takeUntilDestroyed())
      .subscribe((event) => {
        if (event.type === 'VERSION_READY') {
          this._updateAvailable.next(true);
        }
      });
  }

  activateUpdate(): Promise<void> {
    return this._swUpdate.activateUpdate().then(() => {
      this._updateAvailable.next(false);
      this._window.location.reload();
    });
  }
}
