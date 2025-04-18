import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { GameService } from '../game.service';
import { Game } from '../models';
import { GameListComponent } from './game-list.component';

describe('GameListComponent', () => {
  let component: GameListComponent;
  let fixture: ComponentFixture<GameListComponent>;
  let gameService: Partial<GameService>;

  const mockGames: Game[] = [
    {
      id: '1',
      date: new Date(),
      status: 'pending',
      homeTeam: 'Team A',
      awayTeam: 'Team B',
      league: 'League A',
    },
    {
      id: '2',
      date: new Date(),
      status: 'in-progress',
      homeTeam: 'Team C',
      awayTeam: 'Team D',
      league: 'League B',
    },
  ];

  beforeEach(async () => {
    gameService = {
      games$: of(mockGames),
    };

    await TestBed.configureTestingModule({
      imports: [GameListComponent, NoopAnimationsModule],
      providers: [
        provideRouter([]),
        { provide: GameService, useValue: gameService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GameListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
