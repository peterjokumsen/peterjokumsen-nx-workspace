import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LogFns, PjLogger } from '@peterjokumsen/ng-services';

import { logUnexpectedContent } from '../fns';
import { MdUnknownComponent } from './md-unknown.component';

jest.mock('../fns');

describe('MdUnknownComponent', () => {
  let component: MdUnknownComponent;
  let fixture: ComponentFixture<MdUnknownComponent>;
  let logFnSpy: Partial<jest.Mocked<LogFns>>;

  beforeEach(async () => {
    logFnSpy = {
      warn: jest.fn().mockName('warn'),
    };
    const logger: PjLogger = {
      to: logFnSpy as LogFns,
    };

    await TestBed.configureTestingModule({
      providers: [
        // providers
        { provide: PjLogger, useValue: logger },
      ],
      declarations: [MdUnknownComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MdUnknownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onInit', () => {
    it('should log warning', () => {
      const logSpy = jest
        .mocked(logUnexpectedContent)
        .mockName('logUnexpectedContent');
      component.content = { type: 'horizontal-rule' };

      component.ngOnInit();

      expect(logSpy).toHaveBeenCalledWith(
        'MdUnknownComponent',
        component.content,
        logFnSpy,
      );
    });
  });
});
