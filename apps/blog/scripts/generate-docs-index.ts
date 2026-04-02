import * as fs from 'fs';
import * as path from 'path';

/**
 * Primitive Frontmatter Parser to avoid workspace dependencies in build script.
 */
function parseFrontmatter(content: string) {
  const frontmatterLineRegex = /^---\s*$/;
  const lines = content.split('\n');
  if (!frontmatterLineRegex.test(lines[0])) {
    return null;
  }

  const result: Record<string, any> = {};
  let i = 1;
  while (i < lines.length && !frontmatterLineRegex.test(lines[i])) {
    const line = lines[i];
    const colonIndex = line.indexOf(':');
    if (colonIndex !== -1) {
      const key = line.substring(0, colonIndex).trim();
      const rawValue = line.substring(colonIndex + 1).trim();

      // Simple unquoting
      const value = rawValue.replace(/^["'](.*)["']$/, '$1');

      if (key === 'tags') {
        if (value.startsWith('[') && value.endsWith(']')) {
          result[key] = value
            .substring(1, value.length - 1)
            .split(',')
            .map((s) => s.trim().replace(/^["'](.*)["']$/, '$1'));
        } else {
          result[key] = value.split(',').map((s) => s.trim());
        }
      } else {
        result[key] = value;
      }
    }
    i++;
  }

  return result;
}

const docsDir = path.join(process.cwd(), 'apps/blog/src/assets/docs');
const outputFilePath = path.join(
  process.cwd(),
  'apps/blog/src/assets/docs-index.json',
);

function scanDir(dir: string, relativePath = ''): any[] {
  const items = fs.readdirSync(dir);
  let results: any[] = [];

  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      results = results.concat(
        scanDir(fullPath, path.join(relativePath, item)),
      );
    } else if (item.endsWith('.md')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      const meta = parseFrontmatter(content);

      if (meta) {
        let entryPath = path
          .join(relativePath, item.replace('.md', ''))
          .replace(/\\/g, '/');

        // Special handling for README.md
        if (item.toLowerCase() === 'readme.md') {
          entryPath = relativePath.replace(/\\/g, '/');
        }

        results.push({
          path: entryPath,
          ...meta,
        });
      }
    }
  }

  return results;
}

const index = scanDir(docsDir);

fs.writeFileSync(outputFilePath, JSON.stringify(index, null, 2));

console.log(
  `Generated docs index at ${outputFilePath} with ${index.length} entries.`,
);
