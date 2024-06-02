import { MarkdownContent } from '../models';

export interface ReadResult {
  content: MarkdownContent;
  nextStart: number;
}
