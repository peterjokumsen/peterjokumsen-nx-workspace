import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { map } from 'rxjs';
import { Position } from '../../models';
import { ScoringService } from './scoring.service';

@Component({
  selector: 'app-field-status',
  imports: [CommonModule],
  template: `
    @for (pos of positions; track pos.position) {
      <div class="player">
        <span class="label">{{ pos.label }}</span>
        <span>{{ getFielder(pos.position) | async }}</span>
      </div>
    }
  `,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .player {
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
export class FieldStatusComponent {
  private _scoring = inject(ScoringService);

  positions: Array<{ position: Position; label: string }> = [
    { position: 'P', label: 'Pitcher' },
    { position: '1', label: 'First Base' },
    { position: '2', label: 'Second Base' },
    { position: '3', label: 'Third Base' },
    { position: 'SS', label: 'Short Stop' },
    { position: 'LF', label: 'Left Field' },
    { position: 'CF', label: 'Center Field' },
    { position: 'RF', label: 'Right Field' },
  ];

  getFielder(position: Position) {
    return this._scoring.fielders$.pipe(
      map((fielders) => fielders.find((f) => f.position === position)),
      map((f) => this._scoring.getPlayer(f?.playerId ?? '')?.name ?? ''),
    );
  }
}
