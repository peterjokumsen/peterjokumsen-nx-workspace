import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  imports: [],
  providers: [],
  template: `
    <footer>
      <p>&copy; 2024 Peter Jokumsen. All rights reserved.</p>
    </footer>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {}
