import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { GameStore } from './signal-store';
import { CommonModule } from '@angular/common';
import { GameStatusComponent, TeamComponent } from './components';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCardModule } from '@angular/material/card';
import { GamePlayComponent } from './components/game-play.component';

@Component({
  imports: [
    CommonModule,
    RouterModule,
    TeamComponent,
    MatExpansionModule,
    GameStatusComponent,
    GamePlayComponent,
  ],
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
    <mat-expansion-panel>
      <mat-expansion-panel-header>
        <mat-panel-title> Game Status </mat-panel-title>
        <mat-panel-description>
          Status of the current game
        </mat-panel-description>
      </mat-expansion-panel-header>
      <app-game-status />
    </mat-expansion-panel>

    <app-game-play />
  `,
  styleUrl: 'app.component.scss',
  providers: [GameStore],
})
export class AppComponent {
  store = inject(GameStore);
  game = this.store.game;
}
