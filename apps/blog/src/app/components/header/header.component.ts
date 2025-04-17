import { CommonModule, NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';
import {
  LoadingComponent,
  PjUiRouterNavigationElement,
  RouterNavComponent,
} from '@peterjokumsen/ui-elements';

import { toSignal } from '@angular/core/rxjs-interop';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faCode } from '@fortawesome/free-solid-svg-icons';
import { HttpCallCountService } from '@peterjokumsen/ng-services';
import { debounceTime } from 'rxjs';

@Component({
  selector: 'app-header',
  imports: [
    CommonModule,
    NgOptimizedImage,
    RouterNavComponent,
    FaIconComponent,
    LoadingComponent,
  ],
  templateUrl: './header.component.html',
  styles: `
    header {
      display: flex;
      flex-direction: column;
      padding: 10px;

      @media (min-width: 890px) {
        justify-content: space-between;
        flex-direction: row;
        align-items: end;
      }
    }

    .alt-text {
      color: var(--mat-sys-on-surface-variant);
    }

    .title {
      display: flex;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  private _httpCount = inject(HttpCallCountService);
  imageSrc = 'assets/logo-150.webp';

  loadingCount = toSignal(this._httpCount.count$.pipe(debounceTime(10)));
  codeIcon = faCode;
  navElements = input<PjUiRouterNavigationElement[]>([]);
}
