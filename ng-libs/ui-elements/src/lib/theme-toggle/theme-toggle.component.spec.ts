import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PjTheme, PjThemes } from '@peterjokumsen/ng-services';

import { BehaviorSubject } from 'rxjs';
import { OutputEmitterRef } from '@angular/core';
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
    component.themeSelected = {
      emit: jest.fn(),
    } as unknown as OutputEmitterRef<PjThemes>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('themeSelected', () => {
    it('should emit the current theme', () => {
      expect(component.themeSelected.emit).toHaveBeenCalledWith('light');
    });
  });

  describe('buttonLabel', () => {
    it('should return a label for the button', () => {
      expect(component.buttonLabel()).toEqual('Switch to Dark mode');
    });
  });

  describe('toggleTheme', () => {
    it('should toggle the theme', () => {
      component.toggleTheme();
      expect(component.themeSelected.emit).toHaveBeenCalledWith('dark');
    });
  });
});
