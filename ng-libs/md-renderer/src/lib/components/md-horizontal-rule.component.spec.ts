import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LogFns, PjLogger } from '@peterjokumsen/ng-services';

import { logUnexpectedContent } from '../fns';
import { MdHorizontalRuleComponent } from './md-horizontal-rule.component';

jest.mock('../fns');

describe('MdHorizontalRuleComponent', () => {
  let component: MdHorizontalRuleComponent;
  let fixture: ComponentFixture<MdHorizontalRuleComponent>;
  let logSpy: Partial<jest.Mocked<LogFns>>;

  beforeEach(async () => {
    logSpy = {
      warn: jest.fn().mockName('warn'),
    };
    const logger: PjLogger = { to: logSpy as LogFns };

    await TestBed.configureTestingModule({
      providers: [
        // providers
        { provide: PjLogger, useValue: logger },
      ],
      declarations: [MdHorizontalRuleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MdHorizontalRuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('content', () => {
    describe('when value is string', () => {
      it('should log a warning', () => {
        const logFnSpy = jest
          .mocked(logUnexpectedContent)
          .mockName('logUnexpectedContent');
        component.content = 'string';

        expect(logFnSpy).toHaveBeenCalledWith(
          'MdHorizontalRuleComponent',
          'string',
          logSpy,
        );
        expect(component.showRule()).toBeFalsy();
      });
    });

    describe('when value is "horizontal-rule"', () => {
      beforeEach(() => {
        component.content = { type: 'horizontal-rule' };
        fixture.detectChanges();
      });

      it('should set showRule to true', () => {
        expect(component.showRule()).toBeTruthy();
      });

      it('should show <hr /> element', () => {
        const hr = fixture.nativeElement.querySelector('hr');
        expect(hr).toBeTruthy();
      });
    });
  });
});
