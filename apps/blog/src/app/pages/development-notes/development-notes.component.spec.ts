import {
  ArticleComponent,
  PageIntroductionComponent,
} from '@peterjokumsen/ui-elements';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DevelopmentNotesComponent } from './development-notes.component';
import { MockComponent } from 'ng-mocks';

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
            MockComponent(ArticleComponent),
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
