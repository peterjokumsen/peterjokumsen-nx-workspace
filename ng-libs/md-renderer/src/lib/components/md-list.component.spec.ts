import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LogFns, PjLogger } from '@peterjokumsen/ng-services';

import { HasContent } from '../has-content';
import { MdContentService } from '../services';
import { MdListComponent } from './md-list.component';
import { MdWrapperComponent } from './md-wrapper.component';
import { MockComponent } from 'ng-mocks';
import { logUnexpectedContent } from '../fns';

jest.mock('../fns');

describe('MdListComponent', () => {
  let component: MdListComponent;
  let fixture: ComponentFixture<MdListComponent>;
  let logFnSpy: Partial<jest.Mocked<LogFns>>;
  let mdContentSpy: Partial<jest.Mocked<MdContentService>>;

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
        .mockReturnValue([])
        .mockName('MdContentService.getContent'),
      addId: jest
        .fn()
        .mockImplementation((v) => ({ ...v, id: 'id' }))
        .mockName('MdContentService.addId'),
    };

    await TestBed.configureTestingModule({
      providers: [
        // providers
        { provide: PjLogger, useValue: logger },
        { provide: MdContentService, useValue: mdContentSpy },
      ],
      declarations: [MockComponent(MdWrapperComponent), MdListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MdListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize list', () => {
    expect(component.list()).toEqual({
      type: 'list',
      id: '',
      items: [],
      indent: 0,
    });
  });

  describe('content', () => {
    describe('when type is not "list"', () => {
      let logSpy: jest.MockedFunction<typeof logUnexpectedContent>;

      beforeEach(() => {
        logSpy = jest
          .mocked(logUnexpectedContent)
          .mockName('logUnexpectedContent');
      });

      it('should log a warning', () => {
        component.content = 'content';

        expect(logSpy).toHaveBeenCalledWith(
          'MdListComponent',
          'content',
          logFnSpy,
        );
      });

      it('should reset list', () => {
        component.list.update(() => ({
          type: 'list',
          id: 'id',
          items: [{ type: 'paragraph', content: [] }],
          indent: 1,
        }));

        component.content = 'content';

        expect(component.list()).toEqual({
          type: 'list',
          id: '',
          items: [],
          indent: 0,
        });
      });
    });

    describe('when type is "list"', () => {
      it('should update $.list', () => {
        const newContent: HasContent<'list'>['content'] = {
          type: 'list',
          items: [{ type: 'paragraph', content: [] }],
          indent: 1,
        };

        component.content = newContent;

        expect(mdContentSpy.addId).toHaveBeenCalledWith(newContent);
        expect(component.list()).toEqual({ ...newContent, id: 'id' });
      });
    });
  });
});
