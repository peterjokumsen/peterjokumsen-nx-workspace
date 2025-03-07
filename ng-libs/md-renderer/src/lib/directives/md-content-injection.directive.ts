import { Directive, Input, inject } from '@angular/core';
import {
  ExpectedContentTypes,
  filterContentTypes,
} from '../filter-content-types';

import { MarkdownType } from '@peterjokumsen/ts-md-models';
import { MdComponentMapService } from '../services';
import { MdWrapperComponent } from '../components';
import { PjLogger } from '@peterjokumsen/ng-services';
import { WithId } from '../models';

@Directive({
  selector: 'pj-mdr-md-wrapper[pjMdrMdContentInjection]',
  host: {
    class: 'pj-mdr-md-content-injection',
  },
  standalone: false,
})
export class MdContentInjectionDirective {
  private _logger = inject(PjLogger, { optional: true });
  private componentMap = inject(MdComponentMapService);
  wrapper = inject(MdWrapperComponent);

  @Input('pjMdrMdContentInjection') set contentToRender(
    value: WithId<MarkdownType<ExpectedContentTypes>>,
  ) {
    for (const child of this.getChildContents(value)) {
      const component = this.componentMap.getComponent(child.type);
      const instance =
        this.wrapper.container.createComponent(component).instance;
      instance.content = child;
    }
  }

  private getChildContents(content: MarkdownType<ExpectedContentTypes>) {
    if (content.type === 'section') {
      return filterContentTypes(content.contents, (type) =>
        this._logger?.to.warn(
          'Unsupported content type "%s" filtered out of %o',
          type,
          content,
        ),
      );
    }

    return [content];
  }
}
