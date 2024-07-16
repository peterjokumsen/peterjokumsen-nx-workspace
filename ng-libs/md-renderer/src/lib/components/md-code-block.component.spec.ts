import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LogFns, PjLogger } from '@peterjokumsen/ng-services';

import { MdCodeBlockComponent } from './md-code-block.component';
import { logUnexpectedContent } from '../fns';

jest.mock('../fns');

describe('MdCodeBlockComponent', () => {
  let component: MdCodeBlockComponent;
  let fixture: ComponentFixture<MdCodeBlockComponent>;
  let logSpy: Partial<jest.Mocked<LogFns>>;

  beforeEach(async () => {
    logSpy = {
      warn: jest.fn().mockName('warn'),
    };

    await TestBed.configureTestingModule({
      providers: [
        // providers
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
