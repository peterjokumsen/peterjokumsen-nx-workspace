import { RichContentMap } from '../_models';
import { isRichContentString } from './is-rich-content-string';

describe('isRichContentString', () => {
  let map: RichContentMap;

  beforeEach(() => {
    map = {};
  });

  describe('when content is array', () => {
    it('should return false', () => {
      // Act
      const result = isRichContentString([], map);

      expect(result).toBeFalsy();
    });
  });

  describe('when content is empty string', () => {
    it('should return false', () => {
      // Act
      const result = isRichContentString('', map);

      expect(result).toBeFalsy();
    });
  });

  describe('when content has no rich content', () => {
    it('should return false', () => {
      map['rich'] = {
        matched: 'something',
        content: { type: 'text', content: 'rich' },
      };

      // Act
      const result = isRichContentString('plain text', map);

      expect(result).toBeFalsy();
    });
  });

  describe('when content has rich content', () => {
    it('should return true', () => {
      map['rich'] = {
        matched: 'something',
        content: { type: 'text', content: 'rich' },
      };

      // Act
      const result = isRichContentString('plain text with rich', map);

      expect(result).toBeTruthy();
    });
  });
});
