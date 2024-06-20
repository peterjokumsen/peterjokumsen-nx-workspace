import { Directive, Input, inject } from '@angular/core';

import { MarkdownSection } from '@peterjokumsen/ts-md-models';
import { MdComponentMapService } from '../services';
import { MdWrapperComponent } from '../components';
import { PjLogger } from '@peterjokumsen/ng-services';
import { WithId } from '../models';

@Directive({
  selector: 'pj-mdr-md-wrapper[pjMdrMdSection]',
  standalone: true,
  host: {
    class: 'pj-mdr-md-section',
  },
})
export class MdSectionDirective {
  private _logger = inject(PjLogger, { optional: true });
  private componentMap = inject(MdComponentMapService);
  wrapper = inject(MdWrapperComponent);

  @Input('pjMdrMdSection') set section(value: WithId<MarkdownSection>) {
    this._logger?.to.log('MdSectionDirective initialized', this.section);
    for (const child of value.content) {
      const component = this.componentMap.getComponent(child.type);
      const instance =
        this.wrapper.container.createComponent(component).instance;
      instance.content = child;
    }
  }
}
