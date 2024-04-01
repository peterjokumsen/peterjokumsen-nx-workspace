import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiElementsComponent } from './ui-elements.component';

describe('UiElementsComponent', () => {
  let component: UiElementsComponent;
  let fixture: ComponentFixture<UiElementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiElementsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UiElementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
