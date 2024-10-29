import { ChangeDetectionStrategy, Component } from '@angular/core';

import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'ttd-primary-landing',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container">
      <h1>Tasks To Do</h1>
      <p>Welcome to the Tasks To Do application.</p>
      <a routerLink="/app">Go to app</a>
      <img src="/images/tasks-representation_800.webp" alt="Tasks To Do" />
      <p>
        This application is a personal project of mine to try and keep my tasks
        in order.
      </p>
    </div>
  `,
  styleUrl: './primary-landing.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrimaryLandingComponent {}
