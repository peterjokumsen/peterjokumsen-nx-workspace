import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, RouterOutlet } from '@angular/router';
import { AppComponent } from './app.component';
import { ThemeService } from './core/services/theme.service';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  let themeService: Pick<jest.Mocked<ThemeService>, 'setTheme'>;

  beforeEach(async () => {
    themeService = {
      setTheme: jest.fn().mockName('setTheme'),
    };

    await TestBed.configureTestingModule({
      imports: [AppComponent, RouterOutlet],
      providers: [
        { provide: ThemeService, useValue: themeService },
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
