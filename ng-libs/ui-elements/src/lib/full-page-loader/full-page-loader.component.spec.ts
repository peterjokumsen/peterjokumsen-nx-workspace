import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FullPageLoaderComponent } from './';
import { MockComponent } from 'ng-mocks';

describe('FullPageLoaderComponent', () => {
  let component: FullPageLoaderComponent;
  let fixture: ComponentFixture<FullPageLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FullPageLoaderComponent],
    })
      .overrideComponent(FullPageLoaderComponent, {
        set: {
          imports: [MockComponent(FaIconComponent)],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(FullPageLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
