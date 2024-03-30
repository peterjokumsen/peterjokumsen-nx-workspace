import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { faCode } from '@fortawesome/free-solid-svg-icons';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';

@Component({
  standalone: true,
  imports: [RouterOutlet, RouterLinkActive, RouterLink, FaIconComponent],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styles: '',
})
export class AppComponent {
  readonly navElements: Array<{ route: string; title: string }> = [
    { route: '/home', title: 'Home' },
  ];
  codeIcon = faCode;
}
