import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Theme, ThemeService } from './core/services/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatMenuModule,
    MatSidenavModule,
    MatListModule,
  ],
  template: `
    <mat-sidenav-container class="sidenav-container">
      <mat-sidenav #sidenav mode="side" opened class="sidenav">
        <mat-nav-list>
          <a mat-list-item routerLink="/" routerLinkActive="active">
            <mat-icon matListItemIcon>home</mat-icon>
            <span matListItemTitle>Home</span>
          </a>
          <a mat-list-item routerLink="/scores" routerLinkActive="active">
            <mat-icon matListItemIcon>scoreboard</mat-icon>
            <span matListItemTitle>Scores</span>
          </a>
          <a mat-list-item routerLink="/settings" routerLinkActive="active">
            <mat-icon matListItemIcon>settings</mat-icon>
            <span matListItemTitle>Settings</span>
          </a>
        </mat-nav-list>
      </mat-sidenav>

      <mat-sidenav-content>
        <mat-toolbar color="primary">
          <button mat-icon-button (click)="toggleSidenav()">
            <mat-icon>menu</mat-icon>
          </button>
          <span>BB Score</span>
          <span class="spacer"></span>
          <button mat-icon-button [matMenuTriggerFor]="themeMenu">
            <mat-icon>palette</mat-icon>
          </button>
        </mat-toolbar>

        <mat-menu #themeMenu="matMenu">
          <button mat-menu-item (click)="setTheme('light')">
            <mat-icon>light_mode</mat-icon>
            <span>Light</span>
          </button>
          <button mat-menu-item (click)="setTheme('dark')">
            <mat-icon>dark_mode</mat-icon>
            <span>Dark</span>
          </button>
          <button mat-menu-item (click)="setTheme('system')">
            <mat-icon>computer</mat-icon>
            <span>System</span>
          </button>
        </mat-menu>

        <div class="content">
          <router-outlet></router-outlet>
        </div>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styleUrl: './app.component.scss',
})
export class AppComponent {
  @ViewChild('sidenav') sidenav!: MatSidenav;

  constructor(private themeService: ThemeService) {}

  toggleSidenav() {
    this.sidenav.toggle();
  }

  setTheme(theme: Theme) {
    this.themeService.setTheme(theme);
  }
}
