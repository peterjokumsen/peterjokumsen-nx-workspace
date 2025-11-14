import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-did-he-swing',
  imports: [MatButton],
  template: `
    <h3>Did the batter swing?</h3>
    <div class="questions">
      <button mat-button (click)="setSwing(true)">Yes</button>
      <button mat-button (click)="setSwing(false)">No</button>
    </div>
  `,
  styles: `
    .questions {
      padding: 1rem;
      display: flex;
      justify-content: space-between;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DidTheySwingComponent {
  private _bottomRef =
    inject<MatBottomSheetRef<DidTheySwingComponent>>(MatBottomSheetRef);

  setSwing(swung: boolean) {
    this._bottomRef.dismiss(swung);
  }
}
