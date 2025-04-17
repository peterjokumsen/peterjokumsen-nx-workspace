import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LogFns, PjLogger } from '@peterjokumsen/ng-services';

import { logUnexpectedContent } from '../fns';
import { HighlightedCode } from '../models';
import { CodeHighlightService } from '../services';
import { MdCodeBlockComponent } from './md-code-block.component';

jest.mock('../fns');

describe('MdCodeBlockComponent', () => {
  let component: MdCodeBlockComponent;
  let fixture: ComponentFixture<MdCodeBlockComponent>;
  let codeHighlightSpy: Partial<jest.Mocked<CodeHighlightService>>;
  let logSpy: Partial<jest.Mocked<LogFns>>;

  beforeEach(async () => {
    const mockResult: HighlightedCode = {
      htmlCode: 'html-code',
      language: 'lang',
      code: 'code',
    };
    codeHighlightSpy = {
      highlight: jest.fn().mockName('highlight').mockReturnValue(mockResult),
    };
    logSpy = {
      warn: jest.fn().mockName('warn'),
    };

    await TestBed.configureTestingModule({
      providers: [
        // providers
        { provide: CodeHighlightService, useValue: codeHighlightSpy },
        { provide: PjLogger, useValue: { to: logSpy } },
      ],
      declarations: [MdCodeBlockComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MdCodeBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('content', () => {
    it('should extract lines', () => {
      component.content = { type: 'code-block', lines: ['value1', 'value2'] };
      expect(component.lines()).toEqual('value1\nvalue2');
    });

    it('should extract language', () => {
      component.content = { type: 'code-block', language: 'value', lines: [] };
      expect(component.language()).toEqual('value');
    });

    it('should use code highlight service', () => {
      component.content = {
        type: 'code-block',
        language: 'value',
        lines: ['code'],
      };
      expect(component.highlightedCode()).toBeTruthy();
      expect(codeHighlightSpy.highlight).toHaveBeenCalledWith('code', 'value');
    });

    describe('when content is not a code-block element', () => {
      it('should reset values', () => {
        const logFnSpy = jest
          .mocked(logUnexpectedContent)
          .mockName('logUnexpectedContent');
        component.lines.update(() => 'value');
        component.language.update(() => 'lang');

        component.content = 'value';

        expect(logFnSpy).toHaveBeenCalledWith(
          'MdCodeBlockComponent',
          'value',
          logSpy,
        );
        expect(component.lines()).toEqual(null);
        expect(component.language()).toEqual('');
      });
    });
  });
});
