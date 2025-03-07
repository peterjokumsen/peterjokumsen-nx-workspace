import { ChangeDetectionStrategy, Component } from '@angular/core';

import { CommonModule } from '@angular/common';
import { DisplayMarkdownComponent } from '../../components';

@Component({
  selector: 'app-about-me',
  imports: [CommonModule, DisplayMarkdownComponent],
  template: ` <app-display-markdown [filePath]="'assets/docs/about-me.md'" /> `,
  styles: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutMeComponent {}
