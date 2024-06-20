import { MdParagraphComponent, MdUnknownComponent } from '../components';

import { MarkdownContentType } from '@peterjokumsen/ts-md-models';
import { MdComponentMapService } from './md-component-map.service';
import { TestBed } from '@angular/core/testing';
import { Type } from '@angular/core';

describe('MdComponentMapService', () => {
  let service: MdComponentMapService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MdComponentMapService],
    });
    service = TestBed.inject(MdComponentMapService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getComponent', () => {
    const cases: Array<[MarkdownContentType, Type<unknown>]> = [
      ['paragraph', MdParagraphComponent],
    ];
    it.each(cases)(
      `should return component expected component for "%s"`,
      (type, expected) => {
        expect(service.getComponent(type)).toBe(expected);
      },
    );

    describe('when type is not catered for', () => {
      it('should return UnknownComponent', () => {
        expect(service.getComponent('unknown' as MarkdownContentType)).toBe(
          MdUnknownComponent,
        );
      });
    });
  });
});
