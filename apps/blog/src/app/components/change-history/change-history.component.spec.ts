import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleComponent } from '@peterjokumsen/ui-elements';
import { ChangeHistoryComponent } from './change-history.component';
import { MockComponent } from 'ng-mocks';

describe('ChangeHistoryComponent', () => {
  let component: ChangeHistoryComponent;
  let fixture: ComponentFixture<ChangeHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChangeHistoryComponent],
    })
      .overrideComponent(ChangeHistoryComponent, {
        set: {
          imports: [MockComponent(ArticleComponent)],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(ChangeHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
