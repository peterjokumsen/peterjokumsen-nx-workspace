import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatFabButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MobileTocComponent } from './mobile-toc.component';
import { MockComponents } from 'ng-mocks';
import { TableOfContentsComponent } from './table-of-contents.component';

describe('MobileTocComponent', () => {
  let component: MobileTocComponent;
  let fixture: ComponentFixture<MobileTocComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobileTocComponent],
    })
      .overrideComponent(MobileTocComponent, {
        set: {
          imports: [
            MockComponents(TableOfContentsComponent, MatFabButton, MatIcon),
          ],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(MobileTocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onSectionClicked', () => {
    it('should set expanded to false', () => {
      component.expanded.update(() => true);
      const emitSpy = jest.spyOn(component.sectionClick, 'emit');
      component.onSectionClicked('section-id');
      expect(component.expanded()).toBe(false);
      expect(emitSpy).toHaveBeenCalledWith('section-id');
    });
  });

  describe('navToggle', () => {
    it('should toggle expanded', () => {
      component.navToggle();
      expect(component.expanded()).toBe(true);
      component.navToggle();
      expect(component.expanded()).toBe(false);
    });
  });
});
