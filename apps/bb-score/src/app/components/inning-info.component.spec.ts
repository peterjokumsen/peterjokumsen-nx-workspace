import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InningInfoComponent } from './inning-info.component';

describe('InningInfoComponent', () => {
  let component: InningInfoComponent;
  let fixture: ComponentFixture<InningInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InningInfoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(InningInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
