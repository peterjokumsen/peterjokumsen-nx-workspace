import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
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

import { MdComponentMapService } from '../services';
import { MdContentService } from '../services';
import { MdSectionDirective } from '../directives/md-section.directive';
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
    MdSectionDirective,
    MdWrapperComponent,
  ],
  providers: [MdContentService, MdComponentMapService],
  templateUrl: './md-renderer.component.html',
  styleUrl: './md-renderer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MdRendererComponent implements AfterViewInit {
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

    const observer = new IntersectionObserver(
      (entries) => {
        const intersecting = entries.find((e) => e.isIntersecting);
        const id = intersecting?.target.id ?? '';
        if (id) {
          this._logger?.to.log('Intersecting section:', id, entries);
          this.intersectingSectionId.update(() => id);
        }
      },
      { threshold: 0.75, root: window.document },
    );
    for (const section of this.sectionAnchors ?? []) {
      observer.observe(section.nativeElement);
    }
  }

  onNavigationClick(sectionId: string) {
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
