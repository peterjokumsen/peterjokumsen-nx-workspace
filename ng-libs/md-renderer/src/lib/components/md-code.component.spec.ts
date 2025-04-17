import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LogFns, PjLogger } from '@peterjokumsen/ng-services';

import { logUnexpectedContent } from '../fns';
import { MdCodeComponent } from './md-code.component';

jest.mock('../fns');

describe('MdCodeComponent', () => {
  let component: MdCodeComponent;
  let fixture: ComponentFixture<MdCodeComponent>;
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
      declarations: [MdCodeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MdCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('content', () => {
    it('should extract element value', () => {
      component.content = { type: 'code', element: 'value' };
      expect(component.elementValue()).toEqual('value');
    });

    describe('when content is not a code element', () => {
      it('should reset element value', () => {
        const logFnSpy = jest
          .mocked(logUnexpectedContent)
          .mockName('logUnexpectedContent');
        component.elementValue.update(() => 'value');

        component.content = 'value';

        expect(logFnSpy).toHaveBeenCalledWith(
          'MdCodeComponent',
          'value',
          logSpy,
        );
        expect(component.elementValue()).toEqual('');
      });
    });
  });
});
