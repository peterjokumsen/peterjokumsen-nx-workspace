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
    FaIconComponent,
    NgOptimizedImage,
    RouterNavComponent,
  ],
  template: `
    <header class="primary-block pj-header content">
      <div class="pj-header-title content">
        <div class="pj-header-title-logo">
          <img
            ngSrc="assets/logo-150.webp"
            alt="logo"
            height="150"
            width="150"
            [priority]="true"
          />
        </div>
        <div class="pj-header-title-heading">
          <h1>Peter Jokumsen</h1>
          <h2 class="alt-text">An intentional software developer</h2>
          <p>
            <fa-icon class="mr-2" [icon]="codeIcon" aria-label="Code"></fa-icon>
            using
            <img
              class="mx-2"
              ngSrc="assets/icons/c-sharp.svg"
              width="32"
              height="32"
              alt="C#"
              aria-label="C Sharp"
            />
            &amp;
            <img
              class="ml-2"
              ngSrc="assets/icons/typescript.svg"
              width="32"
              height="32"
              alt="Typescript"
              aria-label="Typescript"
            />
          </p>
        </div>
      </div>
      <pj-ui-router-nav [routes]="navElements()"></pj-ui-router-nav>
    </header>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  codeIcon = faCode;
  navElements = input<PjUiRouterNavigationElement[]>([]);
}
