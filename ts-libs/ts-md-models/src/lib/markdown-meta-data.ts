export interface MarkdownMetaData {
  type: 'frontmatter';
  title?: string;
  description?: string;
  date?: string;
  tags?: string[];
  image?: string;
  imageAlt?: string;
}
