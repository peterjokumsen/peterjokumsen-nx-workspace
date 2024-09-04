import {
  ActivatedRouteSnapshot,
  ChildrenOutletContexts,
  OutletContext,
  Router,
  RouterOutlet,
} from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent, MockDirective } from 'ng-mocks';

import { FooterComponent } from './components/footer';
import { HeaderComponent } from './components/header';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { PjBrowserTools } from '@peterjokumsen/ng-services';
import { PrimaryComponent } from './primary.component';
import { of } from 'rxjs';

describe(`[blog] - ${PrimaryComponent.name}`, () => {
  let fixture: ComponentFixture<PrimaryComponent>;
  let component: PrimaryComponent;

  let contextSpy: Partial<jest.Mocked<ChildrenOutletContexts>>;

  beforeEach(async () => {
    contextSpy = {
      getContext: jest.fn().mockName('getContext'),
    };
    await TestBed.configureTestingModule({
      imports: [PrimaryComponent, NoopAnimationsModule],
      providers: [
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

  it('should create nav elements', () => {
    fixture.detectChanges();
    expect(component.navElements).toEqual(
      expect.arrayContaining([{ route: '', title: 'Home' }]),
    );
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
