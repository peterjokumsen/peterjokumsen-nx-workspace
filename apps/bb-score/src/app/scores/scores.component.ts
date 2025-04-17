import { Component } from '@angular/core';

@Component({
  selector: 'app-scores',
  standalone: true,
  template: `
    <h2>Scores</h2>
    <p>View and manage your game scores here.</p>
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
export class ScoresComponent {}
