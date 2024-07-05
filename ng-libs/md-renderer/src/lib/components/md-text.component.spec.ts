import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LogFns, PjLogger } from '@peterjokumsen/ng-services';

import { By } from '@angular/platform-browser';
import { MarkdownFormatType } from '@peterjokumsen/ts-md-models';
import { MdTextComponent } from './md-text.component';
import { logUnexpectedContent } from '../fns';

jest.mock('../fns');

describe('MdTextComponent', () => {
  let component: MdTextComponent;
  let fixture: ComponentFixture<MdTextComponent>;
  let loggerSpy: Partial<jest.Mocked<LogFns>>;

  beforeEach(async () => {
    loggerSpy = {
      warn: jest.fn().mockName('warn'),
      error: jest.fn().mockName('error'),
    };
    await TestBed.configureTestingModule({
      providers: [
        // providers
        { provide: PjLogger, useValue: { to: loggerSpy } },
      ],
      declarations: [MdTextComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MdTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('content', () => {
    describe('when value is string', () => {
      it('should set textValue to value', () => {
        component.content = 'test';
        expect(component.textValue()).toBe('test');
      });
    });

    describe('when value is MarkdownContent with "text"', () => {
      beforeEach(() => {
        component.content = { type: 'text', content: 'test' };
        fixture.detectChanges();
      });

      it('should set textValue to content', () => {
        expect(component.textValue()).toBe('test');
      });

      it('should contain content', () => {
        expect(fixture.nativeElement.textContent).toContain('test');
      });

      it('should not have leading/trailing whitespace', () => {
        expect(fixture.nativeElement.textContent).not.toMatch(/^\s|\s$/);
      });

      describe('when content has leading/trailing whitespace', () => {
        it('should include leading/trailing whitespace', () => {
          component.content = { type: 'text', content: '  test  ' };
          fixture.detectChanges();
          expect(fixture.nativeElement.textContent).toContain('  test  ');
        });
      });

      const formats: Array<MarkdownFormatType | undefined> = [
        'italic',
        'bold',
        'bold-italic',
        'strike-through',
        'line-break',
        undefined,
      ];
      describe.each(formats)(
        'when content using %s for emphasis',
        (emphasis) => {
          it('should render emphasis', () => {
            component.content = {
              type: 'text',
              format: emphasis,
              content: 'formatted content',
            };
            fixture.detectChanges();
            let foundElement = fixture.debugElement.query(
              By.css(`.${emphasis}`),
            );
            if (!emphasis) {
              foundElement = fixture.debugElement.query(By.css('span'));
            }

            if (!foundElement) {
              throw {
                type: 'error',
                message: `Could not find element using class ${emphasis}`,
              };
            }
            expect(foundElement.nativeElement.textContent).toBe(
              'formatted content',
            );
          });
        },
      );
    });

    describe('when value is not a string or "text"', () => {
      it('should log warning', () => {
        const logSpy = jest
          .mocked(logUnexpectedContent)
          .mockName('logUnexpectedContent');
        const newContent = {
          type: 'paragraph' as never,
          content: 'test',
        } as MdTextComponent['content'];

        component.content = newContent;

        expect(logSpy).toHaveBeenCalledWith(
          'MdTextComponent',
          newContent,
          loggerSpy,
        );
      });
    });
  });
});
