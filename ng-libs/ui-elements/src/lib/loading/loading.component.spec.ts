import {
  AnimationBuilder,
  AnimationFactory,
  AnimationPlayer,
} from '@angular/animations';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadingComponent } from './loading.component';

describe('LoadingComponent', () => {
  let component: LoadingComponent;
  let fixture: ComponentFixture<LoadingComponent>;
  let animationBuilderSpy: Partial<jest.Mocked<AnimationBuilder>>;
  let animationSpy: Partial<jest.Mocked<AnimationFactory>>;
  let playerSpy: Partial<jest.Mocked<AnimationPlayer>>;

  beforeEach(async () => {
    playerSpy = {
      play: jest.fn().mockName('play'),
      onDone: jest.fn().mockName('onDone'),
    };
    animationSpy = {
      create: jest.fn().mockName('create').mockReturnValue(playerSpy),
    };
    animationBuilderSpy = {
      build: jest.fn().mockName('build').mockReturnValue(animationSpy),
    };
    await TestBed.configureTestingModule({
      providers: [
        // keep split
        { provide: AnimationBuilder, useValue: animationBuilderSpy },
      ],
      imports: [LoadingComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LoadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('loadFactor', () => {
    let spinSpy: jest.SpyInstance;

    beforeEach(() => {
      spinSpy = jest.spyOn(component, 'spinImage');
    });

    it('should stop spinning when loadFactor is undefined', () => {
      component.loadFactor = undefined;
      expect(spinSpy).not.toHaveBeenCalled();
      expect(component['_stopSpin']).toBe(true);
    });

    it('should spin when loadFactor is greater than 0', () => {
      component.loadFactor = 1;
      expect(spinSpy).toHaveBeenCalledWith(1);
      expect(component['_stopSpin']).toBe(false);
    });
  });

  describe('spinImage', () => {
    it('should not spin if stopSpin is true', () => {
      component.spinImage(1);
      expect(animationBuilderSpy.build).toHaveBeenCalled();
      expect(animationSpy.create).toHaveBeenCalled();
      expect(playerSpy.play).toHaveBeenCalled();
      expect(playerSpy.onDone).toHaveBeenCalled();
    });
  });
});
