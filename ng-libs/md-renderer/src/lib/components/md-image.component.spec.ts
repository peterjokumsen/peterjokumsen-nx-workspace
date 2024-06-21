import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LogFns, PjLogger } from '@peterjokumsen/ng-services';

import { MdImageComponent } from './md-image.component';

describe('MdImageComponent', () => {
  let component: MdImageComponent;
  let fixture: ComponentFixture<MdImageComponent>;
  let loggerSpy: Partial<jest.Mocked<LogFns>>;

  beforeEach(async () => {
    loggerSpy = {
      warn: jest.fn(),
    };

    const logger: PjLogger = {
      to: loggerSpy as LogFns,
    };

    await TestBed.configureTestingModule({
      providers: [
        // providers
        { provide: PjLogger, useValue: logger },
      ],
      declarations: [MdImageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MdImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('content', () => {
    describe('when using string value', () => {
      it('should log a warning', () => {
        component.content = 'string';
        expect(loggerSpy.warn).toHaveBeenCalledWith(
          'String content not supported for image component, received "%s"',
          'string',
        );
      });
    });

    describe('when using non-image content', () => {
      it('should log a warning', () => {
        component.content = { type: 'horizontal-rule' };
        expect(loggerSpy.warn).toHaveBeenCalledWith(
          'Non-image content passed to image component, received %o',
          { type: 'horizontal-rule' },
        );
      });
    });

    describe('when using image content', () => {
      it('should set alt and src', () => {
        component.content = { type: 'image', alt: 'alt', src: 'src' };
        expect(component.alt).toBe('alt');
        expect(component.src).toBe('src');
      });
    });
  });
});
