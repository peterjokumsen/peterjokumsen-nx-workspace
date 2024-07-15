import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { PjBrowserTools } from '@peterjokumsen/ng-services';
import { TableOfContentsComponent } from './table-of-contents.component';

describe('TableOfContentsComponent', () => {
  let component: TableOfContentsComponent;
  let fixture: ComponentFixture<TableOfContentsComponent>;
  let browserToolsSpy: Partial<jest.Mocked<PjBrowserTools>>;
  let windowSpy: Partial<jest.Mocked<Window>>;

  beforeEach(async () => {
    windowSpy = {
      scrollY: 250,
    };
    browserToolsSpy = {
      window: windowSpy as unknown as Window,
    };
    await TestBed.configureTestingModule({
      imports: [TableOfContentsComponent, NoopAnimationsModule],
      providers: [
        // providers
        { provide: PjBrowserTools, useValue: browserToolsSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TableOfContentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onScroll', () => {
    it('should update scroll height', () => {
      component.inViewSectionId.apply(() => 'section');
      component.onScroll();
      expect(component.showBackToTop()).toBe(true);
    });
  });
});
