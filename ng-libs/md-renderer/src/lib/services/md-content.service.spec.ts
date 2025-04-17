import { MarkdownText, MarkdownType } from '@peterjokumsen/ts-md-models';

import { TestBed } from '@angular/core/testing';
import { WithId } from '../models';
import { MdContentService } from './md-content.service';

describe('MdContentService', () => {
  let service: MdContentService;

  const baseSection: MarkdownType<'section'> = {
    type: 'section',
    title: 'Test Title',
    contents: [],
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MdContentService],
    });
    service = TestBed.inject(MdContentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('addId', () => {
    describe('when object has "type"', () => {
      it('should use "type" for generated id', () => {
        let textResult = service.addId({ type: 'text', content: 'test' });
        expect(textResult.id).toEqual('text_0');

        const result = service.addId({ type: 'paragraph', content: [] });
        expect(result.id).toEqual('paragraph_0');

        textResult = service.addId({ type: 'text', content: 'test' });
        expect(textResult.id).toEqual('text_1');
      });
    });

    describe('when object has title', () => {
      it('should use title converted to kebab-case as id', () => {
        const result = service.addId({ ...baseSection, title: 'Test Title' });
        expect(result.id).toEqual('test-title');
      });

      it('should replace non-word characters with "-"', () => {
        const result = service.addId({
          ...baseSection,
          title: 'Test!&^%Title?',
        });
        expect(result.id).toEqual('test----title-');
      });

      it('should make id unique', () => {
        const result = service.addId({ ...baseSection, title: 'Test Title' });
        expect(result.id).toEqual('test-title');
        const result2 = service.addId({ ...baseSection, title: 'Test Title' });
        expect(result2.id).toEqual('test-title_1');
      });
    });

    describe('when object already has "id"', () => {
      it('should leave "id" as is', () => {
        const result = service.addId({ ...baseSection, id: 'test' });
        expect(result.id).toEqual('test');
      });
    });
  });

  describe('mapContent', () => {
    describe('when value is string', () => {
      it('should return MarkdownText with "id"', () => {
        const result = service.mapContent('test') as WithId<MarkdownText>;
        expect(result.id).toBeTruthy();
        expect(result.type).toEqual('text');
        expect(result.content).toEqual('test');
      });
    });

    describe('when value is MarkdownContent', () => {
      it('should return MarkdownContent with "id"', () => {
        const result = service.mapContent({ type: 'horizontal-rule' });
        expect(result).toEqual(
          expect.objectContaining({
            id: expect.any(String),
            type: 'horizontal-rule',
          }),
        );
      });
    });
  });
});
