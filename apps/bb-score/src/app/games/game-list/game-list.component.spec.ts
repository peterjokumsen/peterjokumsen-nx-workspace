import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { GameCreateComponent } from '../game-create/game-create.component';
import { GameService } from '../game.service';
import { Game } from '../models';
import { GameListComponent } from './game-list.component';

describe('GameListComponent', () => {
  let component: GameListComponent;
  let fixture: ComponentFixture<GameListComponent>;
  let gameService: Pick<jest.Mocked<GameService>, 'getGames' | 'games$'>;
  let bottomSheet: Pick<jest.Mocked<MatBottomSheet>, 'open'>;

  const mockGames: Game[] = [
    {
      id: '1',
      date: new Date(),
      status: 'pending',
      homeTeamId: 'a',
      homeTeamName: 'Team A',
      homeLineup: undefined,
      awayTeamId: 'b',
      awayTeamName: 'Team B',
      awayLineup: undefined,
    },
    {
      id: '2',
      date: new Date(),
      status: 'in-progress',
      homeTeamId: 'c',
      homeTeamName: 'Team C',
      homeLineup: undefined,
      awayTeamId: 'd',
      awayTeamName: 'Team D',
      awayLineup: undefined,
    },
  ];

  beforeEach(async () => {
    bottomSheet = {
      open: jest.fn().mockName('open'),
    };
    gameService = {
      getGames: jest.fn().mockName('getGames').mockReturnValue(of(mockGames)),
      games$: of(mockGames),
    };

    await TestBed.configureTestingModule({
      imports: [GameListComponent, NoopAnimationsModule],
      providers: [
        provideRouter([]),
        { provide: GameService, useValue: gameService },
      ],
    })
      .overrideComponent(GameListComponent, {
        add: {
          providers: [{ provide: MatBottomSheet, useValue: bottomSheet }],
        },
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GameListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open bottom sheet when clicking new game button', () => {
    const newGameButton = fixture.debugElement.nativeElement.querySelector(
      'button[color="primary"]',
    );
    newGameButton.click();

    expect(bottomSheet.open).toHaveBeenCalledWith(GameCreateComponent);
  });
});
