import { ChangeDetectionStrategy, Component } from '@angular/core';

import { DisplayMarkdownComponent } from '../../components';

@Component({
  selector: 'app-about-me',
  imports: [DisplayMarkdownComponent],
  template: ` <app-display-markdown [filePath]="'assets/docs/about-me.md'" /> `,
  styles: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutMeComponent {}
