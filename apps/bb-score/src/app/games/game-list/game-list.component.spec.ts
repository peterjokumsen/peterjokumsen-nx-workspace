import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { Game, GameService } from '../../core/services/game.service';
import { GameListComponent } from './game-list.component';

describe('GameListComponent', () => {
  let component: GameListComponent;
  let fixture: ComponentFixture<GameListComponent>;
  let gameService: Partial<GameService>;

  const mockGames: Game[] = [
    {
      id: '1',
      name: 'Game 1',
      date: new Date(),
      status: 'pending',
      homeTeam: 'Team A',
      awayTeam: 'Team B',
    },
    {
      id: '2',
      name: 'Game 2',
      date: new Date(),
      status: 'in-progress',
      homeTeam: 'Team C',
      awayTeam: 'Team D',
    },
  ];

  beforeEach(async () => {
    gameService = {
      games$: of(mockGames),
    };

    await TestBed.configureTestingModule({
      imports: [GameListComponent],
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
