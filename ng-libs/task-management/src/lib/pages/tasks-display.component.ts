import { ActivatedRoute, Router } from '@angular/router';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { CommonModule } from '@angular/common';
import { map } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'task-mgr-task-summary',
  standalone: true,
  imports: [CommonModule],
  template: `<h2>{{ currentFilter() }} tasks</h2>`,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TasksDisplayComponent {
  private _route = inject(ActivatedRoute);

  currentFilter = toSignal(
    this._route.data.pipe(map((data) => data?.['filter'])),
  );
}
