import { MD_COMPONENT_TYPE_MAP, MdComponentTypeMap } from '../injection.tokens';
import {
  MdImageComponent,
  MdLinkComponent,
  MdParagraphComponent,
  MdTextComponent,
  MdUnknownComponent,
} from '../components';

import { ExpectedContentTypes } from '../filter-content-types';
import { MdComponentMapService } from './md-component-map.service';
import { TestBed } from '@angular/core/testing';
import { Type } from '@angular/core';

describe('MdComponentMapService', () => {
  let service: MdComponentMapService;
  let contentTypeMap: Partial<MdComponentTypeMap>;

  beforeEach(() => {
    contentTypeMap = {};
    TestBed.configureTestingModule({
      providers: [
        // providers
        { provide: MD_COMPONENT_TYPE_MAP, useValue: contentTypeMap },
        MdComponentMapService,
      ],
    });
    service = TestBed.inject(MdComponentMapService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getComponent', () => {
    describe('when type map has type', () => {
      it('should return component from type map', () => {
        contentTypeMap.image = MdParagraphComponent;
        expect(service.getComponent('image')).toBe(MdParagraphComponent);
      });
    });

    describe('when no type map is provided', () => {
      const cases: Array<[ExpectedContentTypes, Type<unknown>]> = [
        ['paragraph', MdParagraphComponent],
        ['image', MdImageComponent],
        ['text', MdTextComponent],
        ['link', MdLinkComponent],
      ];
      it.each(cases)(
        `should return component expected component for "%s"`,
        (type, expected) => {
          expect(service.getComponent(type)).toBe(expected);
        },
      );

      describe('when type is not catered for', () => {
        it('should return UnknownComponent', () => {
          expect(service.getComponent('unknown' as ExpectedContentTypes)).toBe(
            MdUnknownComponent,
          );
        });
      });
    });
  });
});
