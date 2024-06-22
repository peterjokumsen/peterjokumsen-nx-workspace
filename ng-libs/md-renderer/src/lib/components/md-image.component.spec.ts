import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LogFns, PjLogger } from '@peterjokumsen/ng-services';

import { HasContent } from '../has-content';
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
          'String content not supported for MdImageComponent, received "%s"',
          'string',
        );
      });
    });

    describe('when using non-image content', () => {
      it('should log a warning', () => {
        component.content = {
          type: 'horizontal-rule',
        } as unknown as HasContent<'image'>['content'];
        expect(loggerSpy.warn).toHaveBeenCalledWith(
          'Invalid content for MdImageComponent, received %o',
          { type: 'horizontal-rule' },
        );
      });
    });

    describe('when using image content', () => {
      beforeEach(() => {
        component.content = {
          type: 'image',
          alt: 'alt-value',
          src: 'src-value',
        };
        fixture.detectChanges();
      });

      it('should set alt and src', () => {
        const img = component.imageValue();
        expect(img?.alt).toBe('alt-value');
        expect(img?.src).toBe('src-value');
      });

      it('should render an img element in template', () => {
        const img = fixture.nativeElement.querySelector('img');
        expect(img).toBeTruthy();
        expect(img.getAttribute('src')).toBe('src-value');
        expect(img.getAttribute('alt')).toBe('alt-value');
      });
    });
  });
});
