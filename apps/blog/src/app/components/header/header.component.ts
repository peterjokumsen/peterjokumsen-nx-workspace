import {
  ChangeDetectionStrategy,
  Component,
  computed, inject,
  input,
  signal,
} from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import {
  LoadingComponent,
  PjUiRouterNavigationElement,
  RouterNavComponent,
} from '@peterjokumsen/ui-elements';

import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faCode } from '@fortawesome/free-solid-svg-icons';
import { HttpCallCountService } from '@peterjokumsen/ng-services';
import { toSignal } from '@angular/core/rxjs-interop';
import { debounceTime } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    NgOptimizedImage,
    RouterNavComponent,
    FaIconComponent,
    LoadingComponent,
  ],
  templateUrl: './header.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  private _httpCount = inject(HttpCallCountService);
  imageSrc = 'assets/logo-150.webp';

  loadingCount = toSignal(this._httpCount.count$.pipe(debounceTime(10)));
  codeIcon = faCode;
  navElements = input<PjUiRouterNavigationElement[]>([]);
}
