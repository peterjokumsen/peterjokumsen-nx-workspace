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
    describe('when action id is "blog"', () => {
      it('should navigate to the blog page', async () => {
        await component.navigateTo({ id: 'blog', label: '' });

        expect(routerSpy.navigate).toHaveBeenCalledWith(['/blog']);
      });
    });

    describe('when action id is "about-me"', () => {
      it('should scroll to "aboutMe"', async () => {
        const scrollSpy = jest.fn();
        component.aboutMe = {
          nativeElement: { scrollIntoView: scrollSpy },
        } as unknown as ElementRef;

        await component.navigateTo({ id: 'about-me', label: '' });

        expect(scrollSpy).toHaveBeenCalledWith({ behavior: 'smooth' });
      });
    });
  });
});
