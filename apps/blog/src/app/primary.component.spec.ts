import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  ChildrenOutletContexts,
  OutletContext,
  Router,
  RouterOutlet,
} from '@angular/router';
import { MockComponent, MockDirective } from 'ng-mocks';

import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  DocIndexEntry,
  DocsIndexService,
  PjBrowserTools,
} from '@peterjokumsen/ng-services';
import { BehaviorSubject, of } from 'rxjs';
import { FooterComponent } from './components/footer';
import { HeaderComponent } from './components/header';
import { PrimaryComponent } from './primary.component';

describe(`[blog] - ${PrimaryComponent.name}`, () => {
  let fixture: ComponentFixture<PrimaryComponent>;
  let component: PrimaryComponent;

  let contextSpy: Partial<jest.Mocked<ChildrenOutletContexts>>;
  let docsIndexSpy: Pick<jest.Mocked<DocsIndexService>, 'getIndex'>;
  let docsSubject: BehaviorSubject<DocIndexEntry[]>;

  beforeEach(async () => {
    contextSpy = {
      getContext: jest.fn().mockName('getContext'),
    };
    docsSubject = new BehaviorSubject<DocIndexEntry[]>([]);
    docsIndexSpy = {
      getIndex: jest
        .fn()
        .mockName('getIndex')
        .mockReturnValue(docsSubject.asObservable()),
    };

    await TestBed.configureTestingModule({
      imports: [PrimaryComponent, NoopAnimationsModule],
      providers: [
        { provide: DocsIndexService, useValue: docsIndexSpy },
        { provide: PjBrowserTools, useValue: {} },
        { provide: Router, useValue: { events: of() } },
        { provide: ChildrenOutletContexts, useValue: contextSpy },
      ],
    })
      .overrideComponent(PrimaryComponent, {
        set: {
          imports: [
            MockDirective(RouterOutlet),
            MockComponent(FooterComponent),
            MockComponent(HeaderComponent),
          ],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(PrimaryComponent);
    component = fixture.componentInstance;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should use getIndex', () => {
    expect(docsIndexSpy.getIndex).toHaveBeenCalled();
  });

  it('should create nav elements', () => {
    fixture.detectChanges();
    expect(component.navElements).toEqual(
      expect.arrayContaining([{ route: '', title: 'Home' }]),
    );
  });

  describe('blogElements', () => {
    it('should default as empty', () => {
      expect(component.blogElements()).toEqual([]);
    });

    describe('when docIndex emits', () => {
      it('should update blogElements', () => {
        docsSubject.next([{ path: 'about-me', title: 'About Me' }]);
        fixture.detectChanges();
        expect(component.blogElements()).toEqual([
          { route: 'about-me', title: 'About Me' },
        ]);
      });
    });
  });

  describe('getAnimationContext', () => {
    beforeEach(() => {
      contextSpy.getContext?.mockReturnValue({
        route: {
          snapshot: {
            data: { animation: 'something' },
            url: [],
          } as unknown as ActivatedRouteSnapshot,
        },
      } as unknown as OutletContext);
    });

    it('should return null initially', () => {
      expect(component.getAnimationContext()).toBeNull();
    });

    describe('when called multiple times', () => {
      beforeEach(() => {
        component.getAnimationContext();
      });

      it('should return animation when available', () => {
        expect(component.getAnimationContext()).toBe('something');
      });

      it('should return url when animation is not available', () => {
        contextSpy.getContext?.mockReturnValue({
          route: {
            snapshot: {
              data: {},
              url: ['url'],
            } as unknown as ActivatedRouteSnapshot,
          },
        } as unknown as OutletContext);

        expect(component.getAnimationContext()).toEqual(['url']);
      });
    });
  });
});
