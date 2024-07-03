import {
  ChangeDetectionStrategy,
  Component,
  Input,
  computed,
  inject,
  signal,
} from '@angular/core';
import { MarkdownType, mdModelCheck } from '@peterjokumsen/ts-md-models';

import { HasContent } from '../has-content';
import { MdContentService } from '../services';
import { PjLogger } from '@peterjokumsen/ng-services';
import { WithId } from '../models';
import { logUnexpectedContent } from '../fns';

@Component({
  selector: 'pj-mdr-md-section',
  template: `
    @if (section().contents.length > 0) {
      <pj-mdr-md-title [section]="section()"></pj-mdr-md-title>
      <pj-mdr-md-wrapper
        [pjMdrMdContentInjection]="section()"
      ></pj-mdr-md-wrapper>
    }
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MdSectionComponent implements HasContent<'section'> {
  private readonly _defaultSection: WithId<MarkdownType<'section'>> = {
    id: '',
    title: '',
    type: 'section',
    contents: [],
  };
  private _mdContent = inject(MdContentService);
  private _logger = inject(PjLogger, { optional: true });

  section = signal<WithId<MarkdownType<'section'>>>(this._defaultSection);
  title = computed(() => this.section().title);

  @Input()
  set content(value: HasContent<'section'>['content']) {
    let newSection = this._defaultSection;
    if (typeof value !== 'string' && mdModelCheck('section', value)) {
      newSection = this._mdContent.addId(value);
    } else {
      logUnexpectedContent('MdSectionComponent', value, this._logger?.to);
    }

    this.section.update(() => newSection);
  }
}
