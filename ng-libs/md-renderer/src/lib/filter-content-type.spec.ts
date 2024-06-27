import { filterContentTypes } from './filter-content-types';

describe('filterContentTypes', () => {
  it('should filter out unsupported content types', () => {
    const content = {
      type: 'section',
      contents: [
        { type: 'paragraph', id: '1' },
        { type: 'link', id: '2' },
        { type: 'text', id: '3' },
        { type: 'image', id: '4' },
        { type: 'unsupported', id: '5' },
      ],
    };
    const cbSpy = jest.fn().mockName('onTypeFiltered');

    const filtered = filterContentTypes(
      content.contents as Parameters<typeof filterContentTypes>[0],
      cbSpy,
    );

    expect(cbSpy).toHaveBeenCalledTimes(1);
    expect(filtered).toEqual(content.contents.slice(0, 4));
  });
});
