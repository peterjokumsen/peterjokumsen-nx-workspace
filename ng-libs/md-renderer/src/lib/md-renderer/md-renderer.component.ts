import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  PLATFORM_ID,
  QueryList,
  ViewChildren,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { MarkdownAst, MarkdownType } from '@peterjokumsen/ts-md-models';
import { MdComponentMapService, MdContentService } from '../services';
import { MobileTocComponent, TableOfContentsComponent } from '../toc';

import { MdComponentsModule } from '../md-components.module';
import { PjLogger } from '@peterjokumsen/ng-services';
import { WithId } from '../models';

@Component({
  selector: 'pj-mdr-md-renderer',
  standalone: true,
  imports: [
    CommonModule,
    TableOfContentsComponent,
    MobileTocComponent,
    MdComponentsModule,
  ],
  providers: [MdContentService, MdComponentMapService],
  templateUrl: './md-renderer.component.html',
  styleUrl: './md-renderer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MdRendererComponent implements AfterViewInit, OnDestroy {
  private _observer?: IntersectionObserver;
  private _logger = inject(PjLogger, { optional: true });
  private _mdContentService = inject(MdContentService);
  private _platform = inject(PLATFORM_ID);

  @ViewChildren('sectionAnchor') sectionAnchors?: QueryList<ElementRef>;

  parsedContent = input<MarkdownAst>();
  sections = computed<WithId<MarkdownType<'section'>>[]>(() => {
    const sections = this.parsedContent()?.sections ?? [];
    return sections.map((s) => this._mdContentService.addId(s));
  });
  intersectingSectionId = signal<string>('');

  ngAfterViewInit() {
    if (!isPlatformBrowser(this._platform)) return;

    if (typeof IntersectionObserver === 'undefined') {
      this._logger?.to.warn(
        'IntersectionObserver not supported, no section tracking will be done.',
      );
      return;
    }

    this._observer = new IntersectionObserver(
      (entries) => {
        const intersecting = entries.find((e) => e.isIntersecting);
        const id = intersecting?.target.id ?? '';
        if (id) {
          this.intersectingSectionId.update(() => id);
        }
      },
      { threshold: 0.7, rootMargin: '0px 0px -90% 0px' },
    );
    for (const section of this.sectionAnchors ?? []) {
      this._observer?.observe(section.nativeElement);
    }
  }

  ngOnDestroy(): void {
    this._observer?.disconnect();
  }

  onNavigationClick(sectionId: string) {
    if (!sectionId && isPlatformBrowser(this._platform)) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const section = this.sectionAnchors?.find(
      (e) => e.nativeElement.id === sectionId,
    );
    if (section) {
      section.nativeElement.scrollIntoView({ behavior: 'smooth' });
    } else {
      this._logger?.to.warn(`Section with id "${sectionId}" not found`);
    }
  }
}
