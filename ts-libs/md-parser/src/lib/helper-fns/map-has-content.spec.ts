import { MatchedContentMap } from '../_models';
import { mapHasContent } from './map-has-content';
import { RegexContentType } from './provide-regex-tools';

describe('mapHasContent', () => {
  let map: MatchedContentMap<RegexContentType>;

  beforeEach(() => {
    map = {};
  });

  describe('when content is array', () => {
    it('should return false', () => {
      // Act
      const result = mapHasContent([], map);

      expect(result).toBeFalsy();
    });
  });

  describe('when content is empty string', () => {
    it('should return false', () => {
      // Act
      const result = mapHasContent('', map);

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
      const result = mapHasContent('plain text', map);

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
      const result = mapHasContent('plain text with rich', map);

      expect(result).toBeTruthy();
    });
  });
});
