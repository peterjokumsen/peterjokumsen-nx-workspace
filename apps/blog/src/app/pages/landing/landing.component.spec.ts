import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutMeComponent } from '../../components/about-me';
import { ElementRef } from '@angular/core';
import { LandingComponent } from './landing.component';
import { MockComponent } from 'ng-mocks';
import { PageIntroductionComponent } from '@peterjokumsen/ui-elements';
import { Router } from '@angular/router';

describe('LandingComponent', () => {
  let component: LandingComponent;
  let fixture: ComponentFixture<LandingComponent>;
  let routerSpy: jest.Mocked<Router>;

  beforeEach(async () => {
    routerSpy = {
      navigate: jest.fn(() => Promise.resolve(true)),
    } as unknown as jest.Mocked<Router>;

    await TestBed.configureTestingModule({
      imports: [LandingComponent],
      providers: [{ provide: Router, useValue: routerSpy }],
    })
      .overrideComponent(LandingComponent, {
        set: {
          imports: [
            MockComponent(AboutMeComponent),
            MockComponent(PageIntroductionComponent),
          ],
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
    let eventSpy: jest.Mocked<Event>;

    beforeEach(() => {
      eventSpy = { preventDefault: jest.fn() } as unknown as jest.Mocked<Event>;
    });

    it('should prevent the default event', async () => {
      await component.navigateTo('blog', eventSpy);

      expect(eventSpy.preventDefault).toHaveBeenCalled();
    });

    describe('when destination is "blog"', () => {
      it('should navigate to the blog page', async () => {
        await component.navigateTo('blog', eventSpy);

        expect(routerSpy.navigate).toHaveBeenCalledWith(['/blog']);
      });
    });

    describe('when destination is "about-me"', () => {
      it('should scroll to about-me', async () => {
        const scrollSpy = jest.fn();
        component.aboutMe = {
          nativeElement: { scrollIntoView: scrollSpy },
        } as unknown as ElementRef;

        await component.navigateTo('about-me', eventSpy);

        expect(scrollSpy).toHaveBeenCalledWith({ behavior: 'smooth' });
      });
    });
  });
});
