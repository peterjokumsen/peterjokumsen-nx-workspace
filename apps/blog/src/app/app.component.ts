import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { Component } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { NgOptimizedImage } from '@angular/common';
import { faCode } from '@fortawesome/free-solid-svg-icons';

@Component({
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLinkActive,
    RouterLink,
    FaIconComponent,
    NgOptimizedImage,
  ],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styles: `
    a.router-link-active {
      @apply bg-gray-400 text-pink-600;
      cursor: default;

      &:hover {
        @apply text-pink-600;
      }
    }
  `,
})
export class AppComponent {
  readonly navElements: Array<{ route: string; title: string }> = [
    { route: '/about-me', title: 'About Me' },
    { route: '/home', title: 'Home' },
  ];
  codeIcon = faCode;
}
