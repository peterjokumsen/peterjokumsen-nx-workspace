import { BreakpointObserver } from '@angular/cdk/layout';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, RouterOutlet } from '@angular/router';
import { of } from 'rxjs';
import { AppComponent } from './app.component';
import { ThemeService } from './core/services/theme.service';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  let themeService: Pick<jest.Mocked<ThemeService>, 'setTheme'>;
  let breakpointObserver: Pick<jest.Mocked<BreakpointObserver>, 'observe'>;

  beforeEach(async () => {
    breakpointObserver = {
      observe: jest.fn().mockReturnValue(of({ matches: false })),
    };
    themeService = {
      setTheme: jest.fn().mockName('setTheme'),
    };

    await TestBed.configureTestingModule({
      imports: [AppComponent, RouterOutlet],
      providers: [
        { provide: ThemeService, useValue: themeService },
        { provide: BreakpointObserver, useValue: breakpointObserver },
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
