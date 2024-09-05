import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutMeComponent } from './about-me.component';
import { By } from '@angular/platform-browser';
import { DisplayMarkdownComponent } from '../../components/display-markdown/display-markdown.component';
import { MockComponent } from 'ng-mocks';

describe('AboutMeComponent', () => {
  let component: AboutMeComponent;
  let fixture: ComponentFixture<AboutMeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AboutMeComponent],
    })
      .overrideComponent(AboutMeComponent, {
        set: {
          imports: [MockComponent(DisplayMarkdownComponent)],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(AboutMeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should use display component with "assets/docs/about-me.md" file path', () => {
    const displayMarkdownComponent = fixture.debugElement.query(
      By.directive(DisplayMarkdownComponent),
    );
    expect(displayMarkdownComponent).toBeTruthy();
    expect(displayMarkdownComponent.componentInstance.filePath).toBe(
      'assets/docs/about-me.md',
    );
  });
});
