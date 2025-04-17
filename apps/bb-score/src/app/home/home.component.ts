import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  template: `
    <h2>Welcome to BB Score</h2>
    <p>Track and manage your basketball scores with ease.</p>
  `,
  styles: [
    `
      :host {
        display: block;
        padding: 1rem;
      }
    `,
  ],
})
export class HomeComponent {}
