import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PjTheme, PjThemes } from '@peterjokumsen/ng-services';

import { BehaviorSubject } from 'rxjs';
import { ThemeToggleComponent } from './theme-toggle.component';

describe('ThemeToggleComponent', () => {
  let component: ThemeToggleComponent;
  let fixture: ComponentFixture<ThemeToggleComponent>;
  let themeSubject: BehaviorSubject<PjThemes>;
  let themeSpy: jest.Mocked<PjTheme>;

  beforeEach(async () => {
    themeSubject = new BehaviorSubject<PjThemes>('light');
    themeSpy = {
      theme$: themeSubject.asObservable(),
      setTheme: jest.fn(),
    } as unknown as jest.Mocked<PjTheme>;

    await TestBed.configureTestingModule({
      imports: [ThemeToggleComponent],
      providers: [
        // keep split
        { provide: PjTheme, useValue: themeSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ThemeToggleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('buttonLabel', () => {
    it('should return a label for the button', () => {
      expect(component.buttonLabel()).toEqual('Switch to Dark mode');
    });
  });

  describe('toggleTheme', () => {
    it('should toggle the theme', () => {
      component.toggleTheme();
      expect(themeSpy.setTheme).toHaveBeenCalledWith('dark');
    });
  });
});
