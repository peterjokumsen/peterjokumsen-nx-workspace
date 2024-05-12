import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThemeProviderService } from './services/theme-provider.service';
import { ThemeToggleComponent } from './theme-toggle.component';

describe('ThemeToggleComponent', () => {
  let component: ThemeToggleComponent;
  let fixture: ComponentFixture<ThemeToggleComponent>;
  let themeProviderSpy: jest.Mocked<ThemeProviderService>;

  beforeEach(async () => {
    themeProviderSpy = {
      theme: jest.fn(() => 'light') as any, // dunno better way to mock signal...
      setTheme: jest.fn(),
    } as unknown as jest.Mocked<ThemeProviderService>;

    await TestBed.configureTestingModule({
      imports: [ThemeToggleComponent],
    })
      .overrideComponent(ThemeToggleComponent, {
        set: {
          providers: [
            { provide: ThemeProviderService, useValue: themeProviderSpy },
          ],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(ThemeToggleComponent);
    component = fixture.componentInstance;
    component.themeSelected = { emit: jest.fn() } as any;
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
      expect(themeProviderSpy.setTheme).toHaveBeenCalledWith('dark');
    });
  });
});
