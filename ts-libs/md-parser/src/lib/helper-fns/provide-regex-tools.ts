import {
  ParagraphContentType,
  SectionContentType,
} from '@peterjokumsen/ts-md-models';

import { MatchedContent } from '../_models';

export type RegexContentType = Exclude<
  ParagraphContentType | SectionContentType,
  | 'section'
  | 'paragraph'
  | 'horizontal-rule'
  | 'code-block'
  | 'code'
  | 'quote'
  | 'ordered-list'
>;

export function provideRegexTools<T extends RegexContentType>(
  value: T,
): {
  regex: RegExp;
  contentFn: (regex: RegExpMatchArray) => MatchedContent<T>;
} {
  switch (value) {
    case 'image':
      return {
        regex: /!\[(.*?)]\((.*?)\)/,
        contentFn: (regex) => {
          const [matched, alt, src] = regex;
          return {
            matched,
            content: {
              type: 'image',
              alt,
              src,
            },
          } as MatchedContent<T>;
        },
      };
    case 'link':
      return {
        regex: /\[(.*?)]\((.*?)\)/,
        contentFn: (regex) => {
          const [matched, content, href] = regex;
          return {
            matched,
            content: {
              type: 'link',
              content,
              href,
            },
          } as MatchedContent<T>;
        },
      };
    case 'text':
      return {
        regex: /.*/,
        contentFn: (regex) => {
          const [matched] = regex;
          return {
            matched,
            content: {
              type: 'text',
              content: matched,
            },
          } as MatchedContent<T>;
        },
      };
    case 'list':
      return {
        regex: /^(\s*)[-*] (.*)/,
        contentFn: (regex) => {
          const [matched, indent, content] = regex;
          return {
            matched,
            content: {
              type: 'list',
              indent: indent.length,
              rawValue: content,
              items: [],
            },
          } as MatchedContent<T>;
        },
      };
    default: {
      // force compilation to fail if a case is missing
      const _: never = value;
      throw new Error(`Content type: "${_}" not supported`);
    }
  }
}
