import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { SwUpdateService } from '../../services/sw-update.service';

@Component({
  selector: 'app-update-toast',
  standalone: true,
  imports: [CommonModule, MatSnackBarModule, MatButtonModule],
  template: `
    <div class="update-toast">
      <span>A new version is available!</span>
      <button mat-button color="accent" (click)="update()">Update Now</button>
    </div>
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

  updateAvailable = toSignal(this._swUpdateService.updateAvailable$);

  constructor() {
    if (this.updateAvailable()) {
      this.showToast();
    }
  }

  showToast(): void {
    this._snackBar.openFromComponent(UpdateToastComponent, {
      duration: undefined, // Keep open until user action
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }

  update(): void {
    this._swUpdateService.activateUpdate();
    this._snackBar.dismiss();
  }
}
