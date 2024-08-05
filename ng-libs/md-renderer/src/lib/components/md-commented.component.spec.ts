import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LogFns, PjLogger } from '@peterjokumsen/ng-services';

import { MdCommentedComponent } from './md-commented.component';
import { logUnexpectedContent } from '../fns';

jest.mock('../fns');

describe('MdCommentedComponent', () => {
  let component: MdCommentedComponent;
  let fixture: ComponentFixture<MdCommentedComponent>;
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
      declarations: [MdCommentedComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MdCommentedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('content', () => {
    it('should extract element value', () => {
      component.content = { type: 'commented', lines: ['value'] };
      expect(component.commentLines()).toEqual(['value']);
    });

    describe('when content is not a commented element', () => {
      it('should reset element value', () => {
        const logFnSpy = jest
          .mocked(logUnexpectedContent)
          .mockName('logUnexpectedContent');
        component.commentLines.update(() => ['value']);

        component.content = 'value';

        expect(logFnSpy).toHaveBeenCalledWith(
          'MdCodeComponent',
          'value',
          logSpy,
        );
        expect(component.commentLines()).toEqual([]);
      });
    });
  });
});
