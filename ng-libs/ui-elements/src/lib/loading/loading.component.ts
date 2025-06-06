import {
  AnimationBuilder,
  AnimationFactory,
  AnimationPlayer,
  animate,
  style,
} from '@angular/animations';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  ViewChild,
  inject,
} from '@angular/core';

@Component({
  selector: 'pj-ui-loading',
  imports: [CommonModule, NgOptimizedImage],
  template: `
    <img #image [ngSrc]="imageSrc" width="150" height="150" alt="Logo" />
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadingComponent {
  private _animationBuilder = inject(AnimationBuilder);
  private _stopSpin = false;
  private _animations: AnimationFactory[] = [];
  private _player: AnimationPlayer | null = null;

  @ViewChild('image', { static: true }) image!: ElementRef<HTMLImageElement>;

  @Input()
  imageSrc = 'assets/logo-150.webp';

  @Input()
  set loadFactor(value: number | undefined) {
    if (!value) {
      this._stopSpin = true;
      return;
    }

    if (value > 0) {
      this.spinImage(value);
    } else {
      this._stopSpin = true;
    }
  }

  spinImage(factor = 1) {
    console.log('Spinning image', factor);
    this._stopSpin = false;
    const timing = 5 / factor;
    const animation = this._animationBuilder.build([
      style({ transform: 'rotate(0deg)' }),
      animate(`${timing}s ease-in-out`, style({ transform: 'rotate(360deg)' })),
    ]);
    this._animations.push(animation);
    if (this._player) {
      return;
    }
    const currentAnimation = this._animations.shift();
    if (!currentAnimation) {
      return;
    }

    this.playAnimation(currentAnimation);
  }

  private playAnimation(currentAnimation: AnimationFactory) {
    this._player = currentAnimation.create(this.image.nativeElement);
    this._player.play();
    this._player.onDone(() => {
      if (!this._stopSpin) {
        this.playAnimation(this._animations.shift() ?? currentAnimation);
      }
    });
  }
}
