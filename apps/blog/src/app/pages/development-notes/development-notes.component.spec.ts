import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageIntroductionComponent } from '@peterjokumsen/ui-elements';
import { MockComponent } from 'ng-mocks';
import { DisplayMarkdownComponent } from '../../components';
import { DevelopmentNotesComponent } from './development-notes.component';

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
