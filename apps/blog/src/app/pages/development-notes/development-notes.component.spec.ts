import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeHistoryComponent } from '../../components/change-history';
import { DevelopmentNotesComponent } from './development-notes.component';
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
            MockComponent(ChangeHistoryComponent),
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
