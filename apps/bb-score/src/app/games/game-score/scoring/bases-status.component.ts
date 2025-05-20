import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ScoringService } from './scoring.service';

@Component({
  selector: 'app-bases-status',
  imports: [CommonModule],
  template: `
    <div class="base">
      <span class="label">Batter</span>
      <span>{{ batter() }}</span>
    </div>
    <div class="base">
      <span class="label">Runner on 1st</span>
      <span>{{ firstBase() }}</span>
    </div>
    <div class="base">
      <span class="label">Runner on 2nd</span>
      <span>{{ secondBase() }}</span>
    </div>
    <div class="base">
      <span class="label">Runner on 3rd</span>
      <span>{{ thirdBase() }}</span>
    </div>
  `,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .base {
      display: flex;
      flex-direction: column;
      gap: 10px;
      align-items: center;
      @media (min-width: 768px) {
        flex-direction: row;
        justify-content: space-between;
      }

      .label {
        font-weight: bold;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BasesStatusComponent {
  private _scoring = inject(ScoringService);
  private _state = toSignal(this._scoring.latestState$);

  batter = computed(() => {
    return this.getRunner(this._state()?.batterId);
  });

  firstBase = computed(() => {
    return this.getRunner(this._state()?.runners['1']);
  });

  secondBase = computed(() => {
    return this.getRunner(this._state()?.runners['2']);
  });

  thirdBase = computed(() => {
    return this.getRunner(this._state()?.runners['3']);
  });

  private getRunner(runnerId?: string): string {
    if (!runnerId) return '';
    return this._scoring.getPlayer(runnerId)?.name ?? '';
  }
}
