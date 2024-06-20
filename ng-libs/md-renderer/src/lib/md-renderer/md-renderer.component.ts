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
import { MarkdownAst, MarkdownSection } from '@peterjokumsen/ts-md-models';
import { MdComponentMapService, MdContentService } from '../services';

import { MdContentInjectionDirective } from '../directives/md-content-injection.directive';
import { MdWrapperComponent } from '../components';
import { PjLogger } from '@peterjokumsen/ng-services';
import { TableOfContentsComponent } from '../toc/table-of-contents.component';
import { WithId } from '../models';

@Component({
  selector: 'pj-mdr-md-renderer',
  standalone: true,
  imports: [
    CommonModule,
    TableOfContentsComponent,
    MdContentInjectionDirective,
    MdWrapperComponent,
  ],
  providers: [MdContentService, MdComponentMapService],
  templateUrl: './md-renderer.component.html',
  styleUrl: './md-renderer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MdRendererComponent implements AfterViewInit, OnDestroy {
  private _observer?: IntersectionObserver;
  private _logger = inject(PjLogger, { optional: true });
  private _uniqueContentService = inject(MdContentService);
  private _platform = inject(PLATFORM_ID);

  @ViewChildren('sectionAnchor') sectionAnchors?: QueryList<ElementRef>;

  parsedContent = input<MarkdownAst>();
  sections = computed<WithId<MarkdownSection>[]>(() => {
    const sections = this.parsedContent()?.sections ?? [];
    return sections.map((s) => this._uniqueContentService.addId(s));
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
          this._logger?.to.log('Intersecting section:', id, entries);
          this.intersectingSectionId.update(() => id);
        }
      },
      { threshold: 0.7 },
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
