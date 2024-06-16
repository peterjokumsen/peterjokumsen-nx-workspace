import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PjTheme } from '@peterjokumsen/ng-services';
import { SplashComponent } from './splash.component';
import { of } from 'rxjs';

describe('SplashComponent', () => {
  let component: SplashComponent;
  let fixture: ComponentFixture<SplashComponent>;
  let themeSpy: Partial<jest.Mocked<PjTheme>>;

  beforeEach(async () => {
    themeSpy = {
      theme$: of('dark'),
      setTheme: jest.fn(),
    };
    await TestBed.configureTestingModule({
      imports: [SplashComponent],
      providers: [{ provide: PjTheme, useValue: themeSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(SplashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set theme', () => {
    expect(themeSpy.setTheme).toHaveBeenCalledWith('dark');
  });
});
