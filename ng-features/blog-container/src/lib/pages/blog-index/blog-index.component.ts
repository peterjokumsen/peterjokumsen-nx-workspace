import { ChangeDetectionStrategy, Component } from '@angular/core';

import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: `blog-index.component.html`,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlogIndexComponent {}
