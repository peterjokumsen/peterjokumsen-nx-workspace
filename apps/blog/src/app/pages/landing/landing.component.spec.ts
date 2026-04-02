import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Router } from '@angular/router';
import { DocsIndexService } from '@peterjokumsen/ng-services';
import { PageIntroductionComponent } from '@peterjokumsen/ui-elements';
import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';
import { LandingComponent } from './landing.component';

describe('LandingComponent', () => {
  let component: LandingComponent;
  let fixture: ComponentFixture<LandingComponent>;
  let routerSpy: jest.Mocked<Router>;
  let docsIndexServiceSpy: jest.Mocked<DocsIndexService>;

  beforeEach(async () => {
    routerSpy = {
      navigate: jest.fn(() => Promise.resolve(true)),
    } as unknown as jest.Mocked<Router>;

    docsIndexServiceSpy = {
      getIndex: jest.fn(() => of([])),
    } as unknown as jest.Mocked<DocsIndexService>;

    await TestBed.configureTestingModule({
      imports: [LandingComponent],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: DocsIndexService, useValue: docsIndexServiceSpy },
      ],
    })
      .overrideComponent(LandingComponent, {
        set: {
          imports: [MockComponent(PageIntroductionComponent)],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(LandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('navigateTo', () => {
    describe('when action id is "development-notes"', () => {
      it('should navigate to the development-notes page', async () => {
        await component.navigateTo({ id: 'development-notes', label: '' });

        expect(routerSpy.navigate).toHaveBeenCalledWith(['development-notes']);
      });
    });
  });
});
