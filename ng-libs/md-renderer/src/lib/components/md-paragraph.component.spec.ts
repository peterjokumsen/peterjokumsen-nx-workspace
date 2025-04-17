import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LogFns, PjLogger } from '@peterjokumsen/ng-services';
import { MarkdownContentType, MarkdownType } from '@peterjokumsen/ts-md-models';

import { logUnexpectedContent } from '../fns';
import { WithId } from '../models';
import { MdContentService } from '../services';
import { MdParagraphComponent } from './md-paragraph.component';

jest.mock('../fns');

describe('MdParagraphComponent', () => {
  let component: MdParagraphComponent;
  let fixture: ComponentFixture<MdParagraphComponent>;
  let logFnSpy: Partial<jest.Mocked<LogFns>>;
  let mdContentSpy: jest.Mocked<Partial<MdContentService>>;

  beforeEach(async () => {
    logFnSpy = {
      warn: jest.fn().mockName('warn'),
    };
    const logger: PjLogger = {
      to: logFnSpy as LogFns,
    };

    mdContentSpy = {
      mapContent: jest
        .fn()
        .mockImplementation(
          <T extends MarkdownContentType>(value: string | MarkdownType<T>) =>
            value as WithId<MarkdownType<T>>,
        )
        .mockName('MdContentService.mapContent'),
    };

    await TestBed.configureTestingModule({
      providers: [
        // providers
        { provide: PjLogger, useValue: logger },
        { provide: MdContentService, useValue: mdContentSpy },
      ],
      declarations: [MdParagraphComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MdParagraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('content', () => {
    describe('when value type is not "image"/"link"/"text"/"paragraph"', () => {
      it('should log a warning', () => {
        const logSpy = jest
          .mocked(logUnexpectedContent)
          .mockName('logUnexpectedContent');
        const newContent = {
          type: 'list',
        } as unknown as WithId<MarkdownType<'paragraph'>>;

        component.content = newContent;

        expect(logSpy).toHaveBeenCalledWith(
          'MdParagraphComponent',
          newContent,
          logFnSpy,
        );
      });
    });

    describe('when value is a string', () => {
      it('should set contents to text content', () => {
        component.content = 'test';
        expect(component.contents()).toEqual([
          { type: 'text', content: 'test' },
        ]);
      });
    });

    describe('when value is MarkdownContent', () => {
      it('should set contents to value', () => {
        const content: MarkdownType<'image'> = {
          type: 'image',
          alt: 'alt',
          src: 'src',
        };
        component.content = content;
        expect(component.contents()).toEqual([content]);
      });

      describe('when value has child contents', () => {
        it('should set contents to child contents', () => {
          const content: MarkdownType<'paragraph'> = {
            type: 'paragraph',
            content: [
              { type: 'text', content: 'testing' },
              { type: 'link', href: 'href', content: 'content' },
            ],
          };
          component.content = content;
          expect(component.contents()).toEqual(content.content);
        });
      });
    });
  });
});
