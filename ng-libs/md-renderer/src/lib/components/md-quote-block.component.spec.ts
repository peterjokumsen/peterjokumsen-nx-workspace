import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LogFns, PjLogger } from '@peterjokumsen/ng-services';
import { MockComponent, MockDirective } from 'ng-mocks';

import { MdContentInjectionDirective } from '../directives/md-content-injection.directive';
import { logUnexpectedContent } from '../fns';
import { MdContentService } from '../services';
import { MdQuoteBlockComponent } from './md-quote-block.component';
import { MdWrapperComponent } from './md-wrapper.component';

jest.mock('../fns');

describe('MdQuoteBlockComponent', () => {
  let component: MdQuoteBlockComponent;
  let fixture: ComponentFixture<MdQuoteBlockComponent>;
  let mdContentSpy: Partial<jest.Mocked<MdContentService>>;
  let logSpy: Partial<jest.Mocked<LogFns>>;

  beforeEach(async () => {
    logSpy = {
      warn: jest.fn().mockName('warn'),
    };
    mdContentSpy = {
      addId: jest
        .fn()
        .mockName('addId')
        .mockImplementation((v) => ({ ...v, id: '1' })),
    };

    await TestBed.configureTestingModule({
      providers: [
        // providers
        { provide: MdContentService, useValue: mdContentSpy },
        { provide: PjLogger, useValue: { to: logSpy } },
      ],
      declarations: [
        MockComponent(MdWrapperComponent),
        MockDirective(MdContentInjectionDirective),
        MdQuoteBlockComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MdQuoteBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('content', () => {
    it('should extract paragraphs', () => {
      component.content = {
        type: 'quote',
        paragraphs: [{ type: 'horizontal-rule' }],
      };
      expect(mdContentSpy.addId).toHaveBeenCalledWith({
        type: 'horizontal-rule',
      });
      expect(component.paragraphs()).toEqual([
        { type: 'horizontal-rule', id: '1' },
      ]);
    });

    describe('when content is not a quote element', () => {
      it('should reset values', () => {
        const logFnSpy = jest
          .mocked(logUnexpectedContent)
          .mockName('logUnexpectedContent');
        component.paragraphs.update(() => [
          { type: 'horizontal-rule', id: '123' },
        ]);

        component.content = 'value';

        expect(logFnSpy).toHaveBeenCalledWith(
          'MdQuoteBlockComponent',
          'value',
          logSpy,
        );
        expect(component.paragraphs()).toEqual([]);
      });
    });
  });
});
