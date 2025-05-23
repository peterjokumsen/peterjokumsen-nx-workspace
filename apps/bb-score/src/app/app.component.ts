import { BreakpointObserver } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { map } from 'rxjs';
import { UpdateToastComponent } from './core/components/update-toast/update-toast.component';
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
    UpdateToastComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  private _breakpointObserver = inject(BreakpointObserver);
  @ViewChild('sidenav') sidenav!: MatSidenav;

  navRoutes = [
    { route: '/', icon: 'home', title: 'Home' },
    { route: '/games', icon: 'sports_baseball', title: 'Games' },
    { route: '/teams', icon: 'groups', title: 'Teams' },
    { route: '/scores', icon: 'scoreboard', title: 'Scores' },
    { route: '/settings', icon: 'settings', title: 'Settings' },
  ];

  isMobile = toSignal(
    this._breakpointObserver
      .observe('(max-width: 600px)')
      .pipe(map(({ matches }) => matches)),
  );

  constructor(private themeService: ThemeService) {}

  toggleSidenav() {
    this.sidenav.toggle();
  }

  setTheme(theme: Theme) {
    this.themeService.setTheme(theme);
  }

  navClicked() {
    if (this.isMobile()) {
      this.sidenav.close();
    }
  }
}
