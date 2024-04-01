import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RouterNavComponent } from './router-nav.component';

describe('RouterNavComponent', () => {
  let component: RouterNavComponent;
  let fixture: ComponentFixture<RouterNavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterNavComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RouterNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
