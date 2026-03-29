import { readMetadata } from './read-frontmatter';

describe('readFrontmatter', () => {
  it('should read frontmatter block correctly', () => {
    const lines = [
      '---',
      'title: A title',
      'description: A description',
      '---',
      '# Heading 1',
    ];

    // index 0 is the start of the frontmatter '---'
    const { result, lastLineIndex } = readMetadata(lines, 0);

    expect(result.type).toBe('frontmatter');
    expect(result.title).toBe('A title');
    expect(result.description).toBe('A description');
    expect(lastLineIndex).toBe(3); // The index of the closing '---'
  });

  it('should return first line without a tagged element', () => {
    const lines = ['---', 'title: A', 'image: test-image.png', '# Heading 1'];

    const { result, lastLineIndex } = readMetadata(lines, 0);

    expect(result.type).toBe('frontmatter');
    expect(result.title).toBe('A');
    expect(result.image).toBe('test-image.png');
    expect(lastLineIndex).toBe(2);
  });

  it('should read tags as an array when provided with brackets and quotes', () => {
    const lines = ['---', 'title: AZ-900', 'tags: ["azure", \'cloud\']', '---'];
    const { result } = readMetadata(lines, 0);
    expect(result.tags).toEqual(['azure', 'cloud']);
  });

  it('should read tags as an array when provided as a comma-separated string', () => {
    const lines = [
      '---',
      'title: AZ-900',
      'tags: azure, cloud, fundamentals',
      '---',
    ];
    const { result } = readMetadata(lines, 0);
    expect(result.tags).toEqual(['azure', 'cloud', 'fundamentals']);
  });

  it('should read tags as an array with a single item when provided as a single string', () => {
    const lines = ['---', 'title: AZ-900', 'tags: azure', '---'];
    const { result } = readMetadata(lines, 0);
    expect(result.tags).toEqual(['azure']);
  });
});
