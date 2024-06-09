import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  ViewChild,
  inject,
  input,
  signal,
} from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { PjBrowserTools, PjLogger } from '@peterjokumsen/ng-services';
import {
  PjUiRouterNavigationElement,
  RouterNavComponent,
} from '@peterjokumsen/ui-elements';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { faChevronRight, faCode } from '@fortawesome/free-solid-svg-icons';

import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { MatFabButton } from '@angular/material/button';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    FaIconComponent,
    NgOptimizedImage,
    RouterNavComponent,
    MatFabButton,
  ],
  templateUrl: './header.component.html',
  styles: `
    .static-header {
      position: fixed;
      top: 0;
    }

    .secondary-header {
      height: 70px;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('showHide', [
      transition(':enter', [
        style({ transform: 'translateX(-100%)' }),
        animate('0.4s', style({ transform: 'translateX(0)' })),
      ]),
      transition(':leave', [
        animate('300ms', style({ transform: 'translateX(-100%)' })),
      ]),
    ]),
    trigger('expandOrCollapse', [
      transition(':enter', [
        style({ transform: 'translateX(-100%)' }),
        animate('0.4s', style({ transform: 'translateX(0)' })),
      ]),
      transition(':leave', [
        animate('300ms', style({ transform: 'translateX(-100%)' })),
      ]),
    ]),
    trigger('rotateExpanded', [
      state('true', style({ transform: 'rotate(180deg)' })),
      state('false', style({ transform: 'rotate(0deg)' })),
      transition('true <=> false', animate('0.4s')),
    ]),
  ],
})
export class HeaderComponent {
  private _logger = inject(PjLogger, { optional: true });
  private _browserTools = inject(PjBrowserTools, { optional: true });

  imageSrc = 'assets/logo-150.webp';
  windowPastHeader = signal<boolean>(false);

  codeIcon = faCode;
  navElements = input<PjUiRouterNavigationElement[]>([]);

  expanded = false;
  chevronIcon = faChevronRight;

  @ViewChild('primaryHeader', { static: true }) primaryHeader?: ElementRef;

  @HostListener('window:scroll')
  onScroll() {
    const windowScrollY = this._browserTools?.window?.scrollY ?? 0;
    const documentHeight =
      this._browserTools?.window?.document?.documentElement.clientHeight ?? 0;
    const headerHeight = this.primaryHeader?.nativeElement.clientHeight ?? 0;
    const pastHeader = windowScrollY > documentHeight + headerHeight;
    if (this.windowPastHeader() !== pastHeader) {
      this._logger?.to.log(
        'Window: %s, Document: %s, Header: %s',
        windowScrollY,
        documentHeight,
        headerHeight,
      );
      this.windowPastHeader.update(() => pastHeader);
    }
  }
}
