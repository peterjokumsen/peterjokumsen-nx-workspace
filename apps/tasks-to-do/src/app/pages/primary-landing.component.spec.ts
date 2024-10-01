import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrimaryLandingComponent } from './primary-landing.component';

describe('PrimaryLandingComponent', () => {
  let component: PrimaryLandingComponent;
  let fixture: ComponentFixture<PrimaryLandingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrimaryLandingComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PrimaryLandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
