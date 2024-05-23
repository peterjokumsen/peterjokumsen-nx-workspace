import { PjArticleSection } from '@peterjokumsen/ng-services';
import { PjUiContent } from './pj-ui-content';

export interface PjUiArticleSection extends PjArticleSection {
  title: string;
  content: PjUiContent;
}
