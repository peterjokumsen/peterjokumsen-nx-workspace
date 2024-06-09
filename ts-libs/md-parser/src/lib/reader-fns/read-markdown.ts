import { MarkdownContent } from '../models';
import { contentReaders } from './content-readers';
import { getContentType } from '../helper-fns';

export function* readMarkdown(markdown: string): Generator<MarkdownContent> {
  const lines = markdown.replace('\r', '').split('\n');
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.trim() === '') continue;

    const type = getContentType(line);
    const contentReader = contentReaders[type];
    if (contentReader) {
      const { content, nextStart } = contentReader(lines, i);
      yield content;
      i = nextStart;
      continue;
    }

    throw new Error(
      `Content type: "${type}" not supported. Line: "${line}":${i}`,
    );
  }
}
