import { MarkdownSection } from './markdown-content';
import { MarkdownMetaData } from './markdown-meta-data';

export interface MarkdownAst extends Omit<MarkdownMetaData, 'type'> {
  sections: MarkdownSection[];
}
