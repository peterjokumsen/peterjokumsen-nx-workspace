import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LogFns, PjLogger } from '@peterjokumsen/ng-services';
import { MockComponent, MockDirective } from 'ng-mocks';

import { MdContentInjectionDirective } from '../directives/md-content-injection.directive';
import { logUnexpectedContent } from '../fns';
import { HasContent } from '../has-content';
import { MdContentService } from '../services';
import { MdSectionComponent } from './md-section.component';
import { MdTitleComponent } from './md-title.component';
import { MdWrapperComponent } from './md-wrapper.component';

jest.mock('../fns');

describe('MdSectionComponent', () => {
  let component: MdSectionComponent;
  let fixture: ComponentFixture<MdSectionComponent>;
  let mdContentSpy: Partial<jest.Mocked<MdContentService>>;
  let logFnSpy: Partial<jest.Mocked<LogFns>>;

  beforeEach(async () => {
    logFnSpy = {
      warn: jest.fn().mockName('warn'),
    };
    const logger: PjLogger = {
      to: logFnSpy as LogFns,
    };

    mdContentSpy = {
      addId: jest
        .fn()
        .mockImplementation((v) => ({ ...v, id: 'id' }))
        .mockName('addId'),
    };

    await TestBed.configureTestingModule({
      providers: [
        // providers
        { provide: MdContentService, useValue: mdContentSpy },
        { provide: PjLogger, useValue: logger },
      ],
      declarations: [
        MockComponent(MdTitleComponent),
        MockDirective(MdContentInjectionDirective),
        MockComponent(MdWrapperComponent),
        MdSectionComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MdSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have initial section', () => {
    expect(component.section()).toEqual({
      id: '',
      title: '',
      type: 'section',
      contents: [],
    });
  });

  describe('content', () => {
    describe('when value is "section"', () => {
      const initialContent: HasContent<'section'>['content'] = {
        type: 'section',
        contents: [{ type: 'paragraph', content: [] }],
        title: 'title',
      };

      beforeEach(() => {
        component.content = initialContent;
        fixture.detectChanges();
      });

      it('should call mapContent', () => {
        expect(mdContentSpy.addId).toHaveBeenCalledWith(initialContent);
      });

      it('should update $.section', () => {
        expect(component.section()).toEqual({ ...initialContent, id: 'id' });
      });

      it('should update $.title', () => {
        expect(component.title()).toEqual('title');
      });
    });

    describe('when value is not "section"', () => {
      let logSpy: jest.MockedFunction<typeof logUnexpectedContent>;

      const initialContent = {
        type: 'paragraph',
        content: [],
      } as unknown as HasContent<'section'>['content'];

      beforeEach(() => {
        logSpy = jest
          .mocked(logUnexpectedContent)
          .mockName('logUnexpectedContent');

        component.section.update(() => ({
          id: 'id',
          title: 'title',
          type: 'section',
          contents: [],
        }));

        component.content = initialContent;
        fixture.detectChanges();
      });

      it('should not call addId', () => {
        expect(mdContentSpy.addId).not.toHaveBeenCalled();
      });

      it('should not reset $.section', () => {
        expect(component.section()).toEqual({
          id: '',
          title: '',
          type: 'section',
          contents: [],
        });
      });

      it('should log warning', () => {
        expect(logSpy).toHaveBeenCalledWith(
          'MdSectionComponent',
          initialContent,
          logFnSpy,
        );
      });
    });
  });
});
