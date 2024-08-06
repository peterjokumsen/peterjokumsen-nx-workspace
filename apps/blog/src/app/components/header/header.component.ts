import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import {
  PjUiRouterNavigationElement,
  RouterNavComponent,
} from '@peterjokumsen/ui-elements';

import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faCode } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    NgOptimizedImage,
    RouterNavComponent,
    FaIconComponent,
  ],
  templateUrl: './header.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  imageSrc = 'assets/logo-150.webp';

  codeIcon = faCode;
  navElements = input<PjUiRouterNavigationElement[]>([]);
}
