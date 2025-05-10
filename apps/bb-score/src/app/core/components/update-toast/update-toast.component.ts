import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_SNACK_BAR_DATA,
  MatSnackBar,
  MatSnackBarModule,
} from '@angular/material/snack-bar';
import { SwUpdateService } from '../../services/sw-update.service';

@Component({
  selector: 'app-update-toast',
  standalone: true,
  imports: [CommonModule, MatSnackBarModule, MatButtonModule],
  template: `
    @let currentStatus = status();
    @if (inToast && currentStatus) {
      <div class="update-toast">
        @switch (currentStatus) {
          @case ('updated') {
            <span>A new version is available!</span>
            <button mat-button color="primary" (click)="update()">
              Update Now
            </button>
          }
          @case ('updating') {
            <span>Updating...</span>
          }
          @case ('failed') {
            <span>Something went wrong while updating</span>
            <button mat-button color="primary" (click)="refresh()">
              Refresh
            </button>
          }
        }

        <button mat-button color="accent" (click)="dismiss()">Dismiss</button>
      </div>
    }
  `,
  styles: [
    `
      .update-toast {
        display: flex;
        align-items: center;
        gap: 16px;
      }
    `,
  ],
})
export class UpdateToastComponent {
  private _swUpdateService = inject(SwUpdateService);
  private _snackBar = inject(MatSnackBar);
  private _snackBarData = inject(MAT_SNACK_BAR_DATA, { optional: true });
  private _updateStatus = toSignal(this._swUpdateService.status$);
  private _toastShown = toSignal(this._swUpdateService.toastShowing$);

  status = computed(() => {
    const status = this._updateStatus();
    if (status === 'current') return null;
    if (!this.inToast && !this._toastShown()) {
      this.showToast();
    }

    return status;
  });

  inToast = this._snackBarData?.inToast ?? false;

  dismiss(): void {
    this._snackBar.dismiss();
    this._swUpdateService.dismissedToast();
  }

  refresh(): void {
    this._swUpdateService.refresh();
  }

  showToast(): void {
    this._swUpdateService.openToast();
    this._snackBar.openFromComponent(UpdateToastComponent, {
      duration: undefined, // Keep open until user action
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      data: {
        inToast: true,
      },
    });
  }

  async update(): Promise<void> {
    await this._swUpdateService.activateUpdate();
    this._snackBar.dismiss();
  }
}
