import { MarkdownAst, MarkdownSection } from '@peterjokumsen/ts-md-models';

import { generateMarkdownSections } from './reader-fns';

export function parseMarkdown(markdown: string): MarkdownAst {
  if (!markdown) {
    return {
      sections: [
        {
          type: 'section',
          title: '',
          contents: [],
        },
      ],
    };
  }

  const sections: MarkdownSection[] = [];
  let currentSection: MarkdownSection | undefined;
  for (const content of generateMarkdownSections(markdown)) {
    if (content.type === 'section') {
      currentSection = content;
      sections.push(currentSection);
      continue;
    }

    if (!currentSection) {
      currentSection = {
        type: 'section',
        title: '',
        contents: [],
      };
      sections.push(currentSection);
    }

    currentSection.contents.push(content);
  }

  return { sections };
}
