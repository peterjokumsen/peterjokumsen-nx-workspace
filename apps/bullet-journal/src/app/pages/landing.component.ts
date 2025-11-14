import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'bu-jo-landing',
  imports: [],
  template: `
    <div class="container">
      <ul>
        <li class="journal-font">Journal</li>
      </ul>
    </div>
  `,
  styles: `
    .container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
    }

    .journal-font {
      font-size: 3rem;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LandingComponent {}
