import { MarkdownContentType, RichContentType } from '../models';

import { MatchedContent } from '../_models';

export const regexPatterns: Partial<Record<MarkdownContentType, RegExp>> = {
  image: /!\[(.*?)]\((.*?)\)/,
  link: /\[(.*?)]\((.*?)\)/,
};

export const regexContentFns: Record<
  RichContentType,
  (regex: RegExpExecArray) => MatchedContent
> = {
  image: (regex) => {
    const [matched, alt, src] = regex;
    return {
      matched,
      content: {
        type: 'image',
        alt,
        src,
      },
    };
  },
  link: (regex) => {
    const [matched, content, href] = regex;
    return {
      matched,
      content: {
        type: 'link',
        content,
        href,
      },
    };
  },
};
