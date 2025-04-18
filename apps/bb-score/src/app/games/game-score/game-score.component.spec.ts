import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { Game, GameService } from '../../core/services/game.service';
import { GameScoreComponent } from './game-score.component';

describe('GameScoreComponent', () => {
  let component: GameScoreComponent;
  let fixture: ComponentFixture<GameScoreComponent>;
  let gameService: Partial<GameService>;

  const mockGame: Game = {
    id: '1',
    name: 'Game 1',
    date: new Date(),
    status: 'in-progress',
    homeTeam: 'Team A',
    awayTeam: 'Team B',
  };

  beforeEach(async () => {
    gameService = {
      getGame: () => of(mockGame),
    };

    await TestBed.configureTestingModule({
      imports: [GameScoreComponent],
      providers: [
        provideRouter([]),
        { provide: GameService, useValue: gameService },
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ id: '1' }),
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GameScoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
