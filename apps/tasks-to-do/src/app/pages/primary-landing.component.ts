import { ChangeDetectionStrategy, Component } from '@angular/core';

import { CommonModule } from '@angular/common';

@Component({
  selector: 'ttd-primary-landing',
  standalone: true,
  imports: [CommonModule],
  template: `
  <div class="container">
    <h1>Tasks To Do</h1>
    <p>Welcome to the Tasks To Do application.</p>
    <img src="/images/tasks-representation_800.webp" alt="Tasks To Do" />
    <p>This application is a personal project of mine to try and keep my tasks in order.</p>
  </div>
  `,
  styles: `
  .container {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    align-items: center;
    justify-content: center;
    min-height: 100svh;
    padding: 1rem;

    h1 {
      padding-top: 3rem;
    }

    img {
      width: 100%;
      max-width: 800px;
    }
  }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrimaryLandingComponent {}
