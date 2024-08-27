import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterComponent } from './components/footer';
import { HeaderComponent } from './components/header';
import { MockComponent } from 'ng-mocks';
import { PjBrowserTools } from '@peterjokumsen/ng-services';
import { PrimaryComponent } from './primary.component';
import { Router } from '@angular/router';
import { RouterNavComponent } from '@peterjokumsen/ui-elements';
import { of } from 'rxjs';

describe(`[blog] - ${PrimaryComponent.name}`, () => {
  let fixture: ComponentFixture<PrimaryComponent>;
  let component: PrimaryComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrimaryComponent],
      providers: [
        { provide: PjBrowserTools, useValue: {} },
        { provide: Router, useValue: { events: of() } },
      ],
    })
      .overrideComponent(PrimaryComponent, {
        set: {
          imports: [
            MockComponent(RouterNavComponent),
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
});
