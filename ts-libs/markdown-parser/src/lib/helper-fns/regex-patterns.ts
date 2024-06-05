import { MarkdownContentType } from '../models';

export const regexPatterns: Partial<Record<MarkdownContentType, RegExp>> = {
  image: /!\[(.*?)]\((.*?)\)/,
  link: /\[(.*?)]\((.*?)\)/,
};
