import { MarkdownSection } from './markdown-content';

export interface MarkdownAst {
  sections: MarkdownSection[];
  tags?: string[];
}
