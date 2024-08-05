import {
  ParagraphContentType,
  SectionContentType,
} from '@peterjokumsen/ts-md-models';

import { MatchedContent } from '../_models';

/**
 * Content types that can be matched.
 */
export type RegexContentType = Exclude<
  ParagraphContentType | SectionContentType,
  | 'section'
  | 'paragraph'
  | 'horizontal-rule'
  | 'code-block'
  | 'quote'
  | 'ordered-list'
>;

/**
 * Provide regex tools for a specific content type.
 * Will return a regex pattern to use for matching the content type and a function to parse the matched content from that regex match.
 * @template T The type of content to provide regex tools for.
 * @param value
 * @returns {{ regex: RegExp, contentFn: (regexMatch: RegExpMatchArray) => MatchedContent<T> }} The regex and content function for the content type.
 */
export function provideRegexTools<T extends RegexContentType>(
  value: T,
): {
  regex: RegExp;
  contentFn: (regex: RegExpMatchArray) => MatchedContent<T>;
} {
  // keeping the switch statement in one place to make it easier to maintain.
  switch (value) {
    case 'code':
      return {
        regex: /`(.+)`/,
        contentFn: (regex) => {
          const [matched, content] = regex;
          return {
            matched,
            content: {
              type: 'code',
              element: content,
            },
          } as MatchedContent<T>;
        },
      };
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
    case 'commented':
      return {
        regex: /<!--(.*)-->/,
        contentFn: (regex) => {
          const [matched, comment] = regex;
          return {
            matched,
            content: {
              type: 'commented',
              lines: comment.trim().split('\n'),
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
