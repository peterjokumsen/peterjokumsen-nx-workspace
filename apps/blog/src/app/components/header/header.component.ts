import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewChild,
  inject,
  input,
  signal,
} from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import {
  MatAnchor,
  MatFabButton,
  MatIconButton,
} from '@angular/material/button';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { PjBrowserTools, PjLogger } from '@peterjokumsen/ng-services';
import {
  PjUiRouterNavigationElement,
  RouterNavComponent,
} from '@peterjokumsen/ui-elements';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { animate, style, transition, trigger } from '@angular/animations';

import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { MatIcon } from '@angular/material/icon';
import { MatToolbar } from '@angular/material/toolbar';
import { faCode } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    NgOptimizedImage,
    RouterNavComponent,
    MatFabButton,
    MatMenu,
    MatMenuItem,
    RouterLink,
    MatAnchor,
    RouterLinkActive,
    MatMenuTrigger,
    FaIconComponent,
    MatToolbar,
    MatIcon,
    MatIconButton,
  ],
  templateUrl: './header.component.html',
  styles: `
    .floating-header {
      position: fixed;
      top: 0;
    }

    .spacer {
      flex: 1 1 auto;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('showHide', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms', style({ opacity: 1 })),
      ]),
      transition(':leave', [animate('100ms', style({ opacity: 0 }))]),
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

  @ViewChild('primaryHeader', { static: true }) primaryHeader?: ElementRef;

  onScroll() {
    const windowScrollY = this._browserTools?.window?.scrollY ?? 0;
    const headerHeight = this.primaryHeader?.nativeElement.clientHeight ?? 0;
    const documentHeight = 0;
    const pastHeader = windowScrollY > documentHeight + headerHeight;
    if (this.windowPastHeader() !== pastHeader) {
      this._logger?.to.debug('Header is past header:', pastHeader);
      this.windowPastHeader.update(() => pastHeader);
    }
  }
}
