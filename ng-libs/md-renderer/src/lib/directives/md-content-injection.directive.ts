import { Directive, Input, inject } from '@angular/core';
import { MarkdownContent, MarkdownSection } from '@peterjokumsen/ts-md-models';

import { MdComponentMapService } from '../services';
import { MdWrapperComponent } from '../components';
import { PjLogger } from '@peterjokumsen/ng-services';
import { WithId } from '../models';

@Directive({
  selector: 'pj-mdr-md-wrapper[pjMdrMdContentInjection]',
  standalone: true,
  host: {
    class: 'pj-mdr-md-content-injection',
  },
})
export class MdContentInjectionDirective {
  private _logger = inject(PjLogger, { optional: true });
  private componentMap = inject(MdComponentMapService);
  wrapper = inject(MdWrapperComponent);

  @Input('pjMdrMdContentInjection') set contentToRender(
    value: WithId<MarkdownContent>,
  ) {
    this._logger?.to.log(
      'MdContentInjection initialized',
      this.contentToRender,
    );

    for (const child of this.getChildContents(value)) {
      const component = this.componentMap.getComponent(child.type);
      const instance =
        this.wrapper.container.createComponent(component).instance;
      instance.content = child;
    }
  }

  private getChildContents(content: MarkdownContent) {
    if (content.type === 'section') {
      return content.content;
    }

    return [content];
  }
}
