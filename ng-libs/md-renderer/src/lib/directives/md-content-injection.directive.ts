import { Directive, Input, inject } from '@angular/core';

import { ExpectedContentTypes } from '../expected-content-types';
import { MarkdownType } from '@peterjokumsen/ts-md-models';
import { MdComponentMapService } from '../services';
import { MdTitleComponent } from '../components/md-title.component';
import { MdWrapperComponent } from '../components';
import { PjLogger } from '@peterjokumsen/ng-services';
import { WithId } from '../models';
import { filterContentTypes } from '../filter-content-types';

@Directive({
  selector: 'pj-mdr-md-wrapper[pjMdrMdContentInjection]',
  host: {
    class: 'pj-mdr-md-content-injection',
  },
})
export class MdContentInjectionDirective {
  private _logger = inject(PjLogger, { optional: true });
  private componentMap = inject(MdComponentMapService);
  wrapper = inject(MdWrapperComponent);

  @Input('pjMdrMdContentInjection') set contentToRender(
    value: WithId<MarkdownType<ExpectedContentTypes>>,
  ) {
    this._logger?.to.log(
      'MdContentInjection initialized',
      this.contentToRender,
    );

    if (value.type === 'section') {
      const titleInstance =
        this.wrapper.container.createComponent(MdTitleComponent).instance;
      titleInstance.section = value;
    }

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
