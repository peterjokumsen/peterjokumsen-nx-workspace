import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MockComponent } from 'ng-mocks';
import { NotFoundComponent } from './not-found.component';
import { PageIntroductionComponent } from '@peterjokumsen/ui-elements';
import { PjLogger } from '@peterjokumsen/ng-services';
import { Router } from '@angular/router';

describe('NotFoundComponent', () => {
  let component: NotFoundComponent;
  let fixture: ComponentFixture<NotFoundComponent>;
  let routerSpy: jest.Mocked<Router>;

  beforeEach(async () => {
    routerSpy = {
      navigate: jest.fn(() => Promise.resolve(true)),
    } as unknown as jest.Mocked<Router>;

    await TestBed.configureTestingModule({
      imports: [NotFoundComponent],
      providers: [
        { provide: PjLogger, useValue: { to: { warn: jest.fn() } } },
        { provide: Router, useValue: routerSpy },
      ],
    })
      .overrideComponent(NotFoundComponent, {
        set: {
          imports: [MockComponent(PageIntroductionComponent)],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(NotFoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
