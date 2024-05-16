import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  output,
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { ThemeProviderService } from './services/theme-provider.service';
import { Themes } from './themes.type';
import { faCircleHalfStroke } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'pj-ui-theme-toggle',
  standalone: true,
  imports: [CommonModule, FaIconComponent],
  providers: [ThemeProviderService],
  template: `
    <button
      class="pj-button primary border-2"
      (click)="toggleTheme()"
      [attr.aria-label]="buttonLabel()"
    >
      <fa-icon [icon]="icon"></fa-icon>
      {{ nextThemeLabel() }}
    </button>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThemeToggleComponent {
  themeProvider = inject(ThemeProviderService);

  icon = faCircleHalfStroke;

  nextTheme = computed(() => {
    const currentTheme = this.themeProvider.theme();
    this.themeSelected.emit(currentTheme);
    return currentTheme === 'dark' ? 'light' : 'dark';
  });

  nextThemeLabel = computed(() => {
    const nextTheme = this.nextTheme();
    return nextTheme === 'dark' ? 'Dark mode' : 'Light mode';
  });

  buttonLabel = computed(() => `Switch to ${this.nextThemeLabel()}`);

  themeSelected = output<Themes>();

  toggleTheme() {
    const nextTheme = this.themeProvider.theme() === 'dark' ? 'light' : 'dark';
    this.themeProvider.setTheme(nextTheme);
  }
}
