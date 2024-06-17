import { Directive, computed, inject, input } from '@angular/core';
import {
  MarkdownContent,
  MarkdownContentType,
} from '@peterjokumsen/ts-md-models';

import { MdContentService } from '../services';
import { PjLogger } from '@peterjokumsen/ng-services';
import { WithId } from '../models';

@Directive()
export abstract class HasContent {
  protected abstract _contentType: MarkdownContentType;
  protected _mdContentService = inject(MdContentService);
  protected _logger = inject(PjLogger, { optional: true });

  content = input<MarkdownContent | string>();
  contentComputed = computed<WithId<MarkdownContent> | null>(() => {
    const content = this.content();
    if (!content) {
      this._logger?.to.warn(
        'No content provided for "%s" component',
        this._contentType,
      );
      return null;
    }

    return this._mdContentService.mapContent(content);
  });
}
