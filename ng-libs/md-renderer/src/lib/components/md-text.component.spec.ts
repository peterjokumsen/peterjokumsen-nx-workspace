import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LogFns, PjLogger } from '@peterjokumsen/ng-services';

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
      });

      it('should set textValue to content', () => {
        expect(component.textValue()).toBe('test');
      });

      it('should render textValue in template', () => {
        fixture.detectChanges();
        const p = fixture.nativeElement;
        expect(p.textContent).toContain('test');
      });
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
