import { MarkdownAst, MarkdownSection } from '@peterjokumsen/ts-md-models';

import { readMarkdown } from './reader-fns';

export function parseMarkdown(markdown: string): MarkdownAst {
  if (!markdown) {
    return {
      sections: [
        {
          type: 'section',
          title: '',
          content: [],
        },
      ],
    };
  }

  const sections: MarkdownSection[] = [];
  let currentSection: MarkdownSection | undefined;
  for (const content of readMarkdown(markdown)) {
    if (content.type === 'section') {
      currentSection = content;
      sections.push(currentSection);
      continue;
    }

    if (!currentSection) {
      currentSection = {
        type: 'section',
        title: '',
        content: [],
      };
      sections.push(currentSection);
    }

    currentSection.content.push(content);
  }

  return { sections };
}
