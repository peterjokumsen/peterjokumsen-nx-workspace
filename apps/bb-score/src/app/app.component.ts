import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { GameStore } from './signal-store';
import { CommonModule } from '@angular/common';
import { TeamComponent } from './components';
import { MatExpansionModule } from '@angular/material/expansion';

@Component({
  imports: [CommonModule, RouterModule, TeamComponent, MatExpansionModule],
  standalone: true,
  selector: 'app-root',
  template: `
    <h1>Simple bb-score</h1>
    <mat-expansion-panel>
      <mat-expansion-panel-header>
        <mat-panel-title> Players </mat-panel-title>
        <mat-panel-description> Player details by teams </mat-panel-description>
      </mat-expansion-panel-header>
      <div class="teams">
        <app-team side="home" />
        <app-team side="away" />
      </div>
    </mat-expansion-panel>
  `,
  styles: `
    :host {
      display: block;
      padding: 1rem;
    }

    .teams {
      display: flex;
      gap: 10px;
      justify-content: space-around;
      flex-direction: column;

      @media (min-width: 800px) {
        flex-direction: row;
      }
    }
  `,
  providers: [GameStore],
})
export class AppComponent {
  store = inject(GameStore);
  game = this.store.game;
}
