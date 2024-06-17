import { Directive, computed, inject, input } from '@angular/core';
import { MarkdownContent, MarkdownText } from '@peterjokumsen/ts-md-models';

import { PjLogger } from '@peterjokumsen/ng-services';

@Directive()
export abstract class HasContent {
  protected _logger = inject(PjLogger);

  content = input<MarkdownContent | string>();
  contentComputed = computed<MarkdownContent>(() => {
    const content = this.content();
    if (!content) {
      this._logger?.to.warn('No content provided for component');
      return { type: 'text', content: '' } as MarkdownText;
    }

    if (typeof content === 'string') {
      return { type: 'text', content } as MarkdownText;
    }
    return content;
  });
}
