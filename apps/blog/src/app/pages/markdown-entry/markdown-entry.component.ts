import {
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  inject,
  OnDestroy,
  signal,
  viewChild,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { PjMarkdownClient, SeoService } from '@peterjokumsen/ng-services';
import { MarkdownAst } from '@peterjokumsen/ts-md-models';
import { PageIntroductionComponent } from '@peterjokumsen/ui-elements';
import { first, map, tap } from 'rxjs';
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
      @if (workingPath(); as path) {
        <app-display-markdown
          [filePath]="path"
          (metadataLoaded)="onMetadataLoaded($event)"
        />
      }
    </div>
  `,
  styleUrl: './markdown-entry.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MarkdownEntryComponent implements OnDestroy {
  private _route = inject(ActivatedRoute);
  private _routePath = toSignal(
    this._route.params.pipe(
      map((params) => decodeURIComponent(params['articlePath'])),
      tap((p) => console.log('param', p)),
    ),
  );
  private _router = inject(Router);
  private _seoService = inject(SeoService);
  private _markdownClient = inject(PjMarkdownClient);

  private _onPathChange = effect(() => {
    const path = this._routePath();
    console.log('path', path);
    if (!path) return;
    this.workingPath.set(undefined);
    this.metadata.set(undefined);
    this._markdownClient
      .resolveMarkdown(path)
      .pipe(first())
      .subscribe({
        next: (result) => {
          this.workingPath.set(result.resolvedPath);
        },
        error: () => {
          this._router.navigate(['/404'], { skipLocationChange: true });
        },
      });
  });

  content = viewChild<ElementRef<HTMLDivElement>>('content');

  workingPath = signal<string | undefined>(undefined);
  metadata = signal<MarkdownAst | undefined>(undefined);

  ngOnDestroy(): void {
    console.log('destroyed', this._routePath());
    this._onPathChange.destroy();
  }

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
