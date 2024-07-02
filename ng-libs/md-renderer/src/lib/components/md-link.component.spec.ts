import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LogFns, PjLogger } from '@peterjokumsen/ng-services';
import { MockComponent, MockDirective } from 'ng-mocks';

import { HasContent } from '../has-content';
import { MdContentInjectionDirective } from '../directives/md-content-injection.directive';
import { MdContentService } from '../services';
import { MdLinkComponent } from './md-link.component';
import { MdWrapperComponent } from './md-wrapper.component';

describe('MdLinkComponent', () => {
  let component: MdLinkComponent;
  let fixture: ComponentFixture<MdLinkComponent>;
  let loggerSpy: Partial<jest.Mocked<LogFns>>;
  let mdContentSpy: Partial<jest.Mocked<MdContentService>>;

  beforeEach(async () => {
    loggerSpy = {
      warn: jest.fn().mockName('warn'),
    };
    mdContentSpy = {
      mapContent: jest
        .fn()
        .mockName('getContents')
        .mockImplementation(
          (content: Parameters<MdContentService['mapContent']>[0]) => {
            if (typeof content === 'string') {
              return { id: '', type: 'text', content };
            }

            return { id: '', ...content };
          },
        ),
    };

    await TestBed.configureTestingModule({
      providers: [
        // providers
        { provide: PjLogger, useValue: { to: loggerSpy } },
        { provide: MdContentService, useValue: mdContentSpy },
      ],
      declarations: [
        MockComponent(MdWrapperComponent),
        MockDirective(MdContentInjectionDirective),
        MdLinkComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MdLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('content', () => {
    describe('when value is string', () => {
      it('should log warning', () => {
        component.content = 'test';
        expect(loggerSpy.warn).toHaveBeenCalledWith(
          'Invalid content for MdLinkComponent, received "%s"',
          'test',
        );
      });
    });

    describe('when value type is not "link"', () => {
      it('should log warning', () => {
        component.content = {
          type: 'paragraph',
          content: 'test',
        } as unknown as HasContent<'link'>['content'];
        expect(loggerSpy.warn).toHaveBeenCalledWith(
          'Invalid content for MdLinkComponent, received %o',
          { type: 'paragraph', content: 'test' },
        );
      });
    });

    describe('when value type is "link" with basic content', () => {
      beforeEach(() => {
        component.content = {
          type: 'link',
          href: 'href-value',
          content: 'content-value',
        };
        fixture.detectChanges();
      });

      it('should set anchor', () => {
        expect(component.anchor()).toEqual(
          expect.objectContaining({ href: 'href-value' }),
        );
        expect(component.anchor()?.content[0]).toEqual(
          expect.objectContaining({ type: 'text', content: 'content-value' }),
        );
      });

      it('should include aria label', () => {
        expect(component.anchor()).toEqual(
          expect.objectContaining({ ariaLabel: 'content-value' }),
        );
      });

      it('should render anchor tag', () => {
        const anchor = fixture.nativeElement.querySelector('a');
        expect(anchor).toBeTruthy();
        expect(anchor.getAttribute('href')).toBe('href-value');
        expect(anchor.getAttribute('aria-label')).toBe('content-value');
      });
    });

    describe('when value type is "link" with multiple contents', () => {
      beforeEach(() => {
        component.content = {
          type: 'link',
          href: 'href-value',
          content: [
            { type: 'text', content: 'text' },
            { type: 'text', content: 'end' },
          ],
        };
        fixture.detectChanges();
      });

      it('should set anchor', () => {
        expect(component.anchor()).toEqual(
          expect.objectContaining({ href: 'href-value' }),
        );
        expect(component.anchor()?.content).toEqual([
          expect.objectContaining({ type: 'text', content: 'text' }),
          expect.objectContaining({ type: 'text', content: 'end' }),
        ]);
      });

      it('should include aria label', () => {
        expect(component.anchor()).toEqual(
          expect.objectContaining({ ariaLabel: 'text end' }),
        );
      });

      it('should render anchor tag', () => {
        const anchor = fixture.nativeElement.querySelector('a');
        expect(anchor).toBeTruthy();
        expect(anchor.getAttribute('href')).toBe('href-value');
        expect(anchor.getAttribute('aria-label')).toBe('text end');
      });
    });
  });
});
