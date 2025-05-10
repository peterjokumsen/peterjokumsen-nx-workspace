import { inject, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SwUpdate } from '@angular/service-worker';
import { BehaviorSubject } from 'rxjs';
import { UpdateStatus } from '../models';

@Injectable({
  providedIn: 'root',
})
export class SwUpdateService {
  private _window = inject(Window, { optional: true }) ?? window;
  private _swUpdate = inject(SwUpdate);
  private _statusSubject = new BehaviorSubject<UpdateStatus>('current');
  private _toastShowingSubject = new BehaviorSubject(false);

  status$ = this._statusSubject.asObservable();
  toastShowing$ = this._toastShowingSubject.asObservable();

  constructor() {
    if (!this._swUpdate.isEnabled) return;

    this._swUpdate.versionUpdates
      .pipe(takeUntilDestroyed())
      .subscribe((event) => {
        switch (event.type) {
          case 'VERSION_READY':
            this._statusSubject.next('updated');
            break;
          case 'VERSION_DETECTED':
            this._statusSubject.next('updating');
            break;
          case 'VERSION_INSTALLATION_FAILED':
            this._statusSubject.next('failed');
            break;
          default:
            this._statusSubject.next('current');
        }
      });
  }

  async activateUpdate(): Promise<void> {
    return this._swUpdate.activateUpdate().then(() => {
      this._statusSubject.next('current');
      this.refresh();
    });
  }

  refresh(): void {
    this._window.location.reload();
  }

  openToast(): void {
    this._toastShowingSubject.next(true);
  }

  dismissedToast(): void {
    this._toastShowingSubject.next(false);
  }
}
