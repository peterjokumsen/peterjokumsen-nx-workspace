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

import { MdContentService } from '../services';
import { PjLogger } from '@peterjokumsen/ng-services';
import { SectionComponent } from '../components';
import { TableOfContentsComponent } from '../toc/table-of-contents.component';
import { WithId } from '../models';

@Component({
  selector: 'pj-mdr-md-renderer',
  standalone: true,
  imports: [CommonModule, SectionComponent, TableOfContentsComponent],
  providers: [MdContentService],
  template: `
    <div class="markdown-document">
      <div class="markdown-navigation">
        @defer {
          <pj-mdr-table-of-contents
            [sections]="sections()"
            [inViewSectionId]="intersectingSectionId()"
            (sectionClick)="onNavigationClick($event)"
          />
        } @placeholder {
          <div class="navigation-placeholder"></div>
        }
      </div>
      <div class="markdown-contents">
        @for (section of sections(); track section.id) {
          <div #sectionAnchor class="section-anchor" id="{{ section.id }}">
            @defer (on viewport) {
              <pj-mdr-section [section]="section"></pj-mdr-section>
            } @placeholder {
              <div class="placeholder" style="height: 100vh"></div>
            }
          </div>
        }
      </div>
    </div>
  `,
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
        this.intersectingSectionId.update(() => id);
      },
      { threshold: 0.5, root: window.document },
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
