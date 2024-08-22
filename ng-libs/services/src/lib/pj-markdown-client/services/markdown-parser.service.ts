import { Injectable } from '@angular/core';
import { MarkdownAst } from '@peterjokumsen/ts-md-models';
import { ToBeParsed } from '../models';
import { parseMarkdown } from '@peterjokumsen/md-parser';

/**
 * Service to parse markdown content, using parseMarkdown after adjusting the content as follows:
 * - Replace any relative image paths with paths relative to the provided base path.
 * - TBD: Add more adjustments as needed.
 *
 * Not intended to be used directly, but rather through the PjMarkdownClient.
 */
@Injectable()
export class MarkdownParserService {
  /**
   * Replace any relative image paths with paths relative to the provided base path.
   * @param markdownContent
   * @param basePath
   * @private
   */
  private transformRelativeImagePaths(
    markdownContent: string,
    basePath: string,
  ): string {
    const regex = /!\[(.*)]\(((?:\.{1,2}\/)*)?(\w+\/)*(\w+.\w+)\)/g;
    return markdownContent.replace(
      regex,
      (_, altText, relativePath, folderPath, fileName) => {
        let base = basePath[0] === '/' ? basePath.slice(1) : basePath;
        if (typeof relativePath === 'string' && relativePath.includes('..')) {
          const baseParts = basePath.split('/').filter((p) => !!p);
          const relativeParts = relativePath.split('/').filter((p) => !!p);
          const parts = baseParts.slice(
            0,
            baseParts.length - relativeParts.length,
          );
          base = `${parts.join('/')}`;
        }

        const path = `/${base}/${folderPath ?? ''}`.replace(/\/+/g, '/');
        return `![${altText}](${path}${fileName})`;
      },
    );
  }

  /**
   * Parse the markdown content.
   * @param markdownContent
   * @param basePath
   */
  parse({ markdownContent, basePath }: ToBeParsed): MarkdownAst {
    markdownContent = this.transformRelativeImagePaths(
      markdownContent,
      basePath,
    );
    return parseMarkdown(markdownContent);
  }
}
