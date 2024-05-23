import { PjArticleContent } from './pj-article-content';
import { PjArticleSection } from './pj-article-section';

export interface PjArticle {
  title?: string;
  introduction?: PjArticleContent;
  sections: PjArticleSection[];
}
