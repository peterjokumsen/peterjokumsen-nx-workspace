import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { GameService } from '../../core/services/game.service';
import { GameCreateComponent } from './game-create.component';

describe('GameCreateComponent', () => {
  let component: GameCreateComponent;
  let fixture: ComponentFixture<GameCreateComponent>;
  let gameService: Partial<GameService>;

  beforeEach(async () => {
    gameService = {
      createGame: jest.fn().mockName('createGame'),
    };

    await TestBed.configureTestingModule({
      imports: [GameCreateComponent],
      providers: [
        provideRouter([]),
        { provide: GameService, useValue: gameService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GameCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
