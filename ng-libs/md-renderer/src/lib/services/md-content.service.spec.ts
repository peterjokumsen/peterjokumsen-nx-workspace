import { MarkdownText } from '@peterjokumsen/ts-md-models';
import { MdContentService } from './md-content.service';
import { TestBed } from '@angular/core/testing';
import { WithId } from '../models';

describe('MdContentService', () => {
  let service: MdContentService;

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
    it('should add incrementing "id" to passed in object', () => {
      let result = service.addId({});
      expect(result.id).toEqual('id_0');
      result = service.addId({});
      expect(result.id).toEqual('id_1');
    });

    describe('when object already has "id"', () => {
      it('should leave "id" as is', () => {
        const result = service.addId({ id: 'test' });
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
