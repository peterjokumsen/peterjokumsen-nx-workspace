import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SeoService } from '@peterjokumsen/ng-services';
import { MarkdownAst } from '@peterjokumsen/ts-md-models';
import { PageIntroductionComponent } from '@peterjokumsen/ui-elements';
import { DisplayMarkdownComponent } from '../../components';

@Component({
  selector: 'app-markdown-entry',
  imports: [PageIntroductionComponent, DisplayMarkdownComponent],
  template: `
    @if (metadata(); as meta) {
      <pj-ui-page-introduction
        [introductionTitle]="meta.title || ''"
        [paragraphs]="meta.description ? [meta.description] : []"
        [style]="{
          url: meta.image || '/assets/intro_background.webp',
          position: 'right',
        }"
        actions="Check out content"
        (callToAction)="scrollToContent()"
      ></pj-ui-page-introduction>
    }

    <div #content>
      <app-display-markdown
        [filePath]="filePath()"
        (metadataLoaded)="onMetadataLoaded($event)"
      />
    </div>
  `,
  styleUrl: './markdown-entry.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MarkdownEntryComponent {
  private _route = inject(ActivatedRoute);
  private _seoService = inject(SeoService);

  content = viewChild<ElementRef<HTMLDivElement>>('content');

  filePath = signal<string>(
    (this._route.snapshot.data as { filePath?: string })['filePath'] ||
      (this._route.snapshot.params as { filePath?: string })['filePath'] ||
      '',
  );
  metadata = signal<MarkdownAst | undefined>(undefined);

  onMetadataLoaded(metadata: MarkdownAst) {
    this.metadata.set(metadata);
    this._seoService.updateFromMarkdown(metadata);
  }

  scrollToContent() {
    this.content()?.nativeElement.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }
}
