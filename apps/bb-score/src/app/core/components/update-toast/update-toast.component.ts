import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
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
    @if (inToast) {
      <div class="update-toast">
        <span>A new version is available!</span>
        <button mat-button color="primary" (click)="update()">
          Update Now
        </button>
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
export class UpdateToastComponent implements OnInit {
  private _swUpdateService = inject(SwUpdateService);
  private _snackBar = inject(MatSnackBar);
  private _snackBarData = inject(MAT_SNACK_BAR_DATA, { optional: true });

  updateAvailable = toSignal(this._swUpdateService.updateAvailable$);
  inToast = this._snackBarData?.inToast ?? false;

  ngOnInit(): void {
    if (this.updateAvailable()) {
      this.showToast();
    }
  }

  dismiss(): void {
    this._snackBar.dismiss();
  }

  showToast(): void {
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
