import { Component } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { NgOptimizedImage } from '@angular/common';
import { RouterNavComponent } from '@peterjokumsen/ui-elements';
import { RouterOutlet } from '@angular/router';
import { faCode } from '@fortawesome/free-solid-svg-icons';

@Component({
  standalone: true,
  imports: [
    RouterOutlet,
    FaIconComponent,
    NgOptimizedImage,
    RouterNavComponent,
  ],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styles: ``,
})
export class AppComponent {
  readonly navElements: Array<{ route: string; title: string }> = [
    { route: '/about-me', title: 'About Me' },
    { route: '/home', title: 'Home' },
  ];
  codeIcon = faCode;
}
