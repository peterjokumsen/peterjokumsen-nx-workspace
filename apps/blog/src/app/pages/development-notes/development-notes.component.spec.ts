import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DevelopmentNotesComponent } from './development-notes.component';
import { DisplayMarkdownComponent } from '../../components';
import { MockComponent } from 'ng-mocks';
import { PageIntroductionComponent } from '@peterjokumsen/ui-elements';

describe('DevelopmentNotesComponent', () => {
  let component: DevelopmentNotesComponent;
  let fixture: ComponentFixture<DevelopmentNotesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DevelopmentNotesComponent],
    })
      .overrideComponent(DevelopmentNotesComponent, {
        set: {
          imports: [
            MockComponent(PageIntroductionComponent),
            MockComponent(DisplayMarkdownComponent),
          ],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(DevelopmentNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
