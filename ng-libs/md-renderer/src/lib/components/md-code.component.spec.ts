import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LogFns, PjLogger } from '@peterjokumsen/ng-services';

import { MdCodeComponent } from './md-code.component';

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
        component.elementValue.update(() => 'value');
        component.content = 'value';
        expect(component.elementValue()).toEqual('');
        expect(logSpy.warn).toHaveBeenCalledWith(
          'Invalid content for MdCodeComponent, received %o',
          'value',
        );
      });
    });
  });
});
