import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { GameService } from '../game.service';
import { GameCreateComponent } from './game-create.component';

describe('GameCreateComponent', () => {
  let component: GameCreateComponent;
  let fixture: ComponentFixture<GameCreateComponent>;
  let gameService: Partial<GameService>;
  let bottomSheetRef: Pick<jest.Mocked<MatBottomSheetRef>, 'dismiss'>;

  beforeEach(async () => {
    gameService = {
      games$: of([]),
      createGame: jest.fn().mockName('createGame'),
    };

    bottomSheetRef = {
      dismiss: jest.fn().mockName('dismiss'),
    };

    await TestBed.configureTestingModule({
      imports: [GameCreateComponent, NoopAnimationsModule],
      providers: [
        { provide: GameService, useValue: gameService },
        { provide: MatBottomSheetRef, useValue: bottomSheetRef },
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

  it('should dismiss bottom sheet when canceling', () => {
    component.onCancel();
    expect(bottomSheetRef.dismiss).toHaveBeenCalled();
  });

  it('should create game and dismiss bottom sheet when submitting valid form', async () => {
    component.gameForm.patchValue({
      date: new Date(),
      homeTeam: 'Team A',
      awayTeam: 'Team B',
    });
    component.gameForm.updateValueAndValidity();

    await component.onSubmit();

    expect(gameService.createGame).toHaveBeenCalled();
    expect(bottomSheetRef.dismiss).toHaveBeenCalled();
  });
});
