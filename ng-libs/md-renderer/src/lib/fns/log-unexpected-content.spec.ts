import { HasContentBase } from '../has-content';
import { LogFns } from '@peterjokumsen/ng-services';
import { logUnexpectedContent } from './log-unexpected-content';

describe('logUnexpectedContent', () => {
  let logSpy: Partial<jest.Mocked<LogFns>>;
  let object: HasContentBase['content'];
  let templateUsed: string;
  let otherParams: Parameters<LogFns['warn']>[1];

  beforeEach(() => {
    logSpy = {
      warn: jest
        .fn()
        .mockImplementation((template, others) => {
          templateUsed = template;
          otherParams = others;
        })
        .mockName('warn'),
    };
  });

  it('should include component name in log', () => {
    logUnexpectedContent('MyComponent', 'value', logSpy as LogFns);
    expect(templateUsed).toContain('MyComponent');
  });

  it('should include "Unexpected content received" in log', () => {
    logUnexpectedContent('MyComponent', 'value', logSpy as LogFns);
    expect(templateUsed).toContain('Unexpected content received');
  });

  describe('when argument is an object', () => {
    it('should use object notation', () => {
      object = { type: 'horizontal-rule' };

      logUnexpectedContent('MyComponent', object, logSpy as LogFns);

      expect(templateUsed).toContain('%o');
      expect(otherParams).toBe(object);
    });
  });

  describe('when argument is a string', () => {
    it('should use string notation', () => {
      object = 'string';

      logUnexpectedContent('MyComponent', object, logSpy as LogFns);

      expect(templateUsed).toContain('"%s"');
      expect(otherParams).toBe(object);
    });
  });

  describe('when log is not provided', () => {
    it('should not throw error', () => {
      expect(() => logUnexpectedContent('MyComponent', 'value')).not.toThrow();
    });
  });
});
