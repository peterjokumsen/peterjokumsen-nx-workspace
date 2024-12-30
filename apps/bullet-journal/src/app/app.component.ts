import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  imports: [RouterModule],
  selector: 'bu-jo-root',
  template: ` <router-outlet></router-outlet> `,
  styles: ``,
})
export class AppComponent {}
