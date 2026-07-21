import { booleanAttribute, computed, Directive, input, InputSignal, Signal } from '@angular/core';
import { BooleanInput, BooleanInputValue } from '../sushi.types';
import { AvatarMaskHalf, AvatarShape, AvatarSize, AvatarStatus } from './avatar.interfaces';

@Directive({
  selector: '[suiAvatar]',
  standalone: true,
  host: {
    class: 'avatar sui-avatar',

    '[class.avatar-placeholder]': 'placeholder()',
    '[class.avatar-online]': 'status() === "online"',
    '[class.avatar-offline]': 'status() === "offline"',
  },
})
export class Avatar {
  public readonly status: InputSignal<AvatarStatus | null> = input<AvatarStatus | null>(null);
  public readonly placeholder: BooleanInput = input<boolean, BooleanInputValue>(false, {
    transform: booleanAttribute,
  });
}

@Directive({
  selector: '[suiAvatarContent]',
  standalone: true,
  host: {
    class: 'sui-avatar-content',

    '[class.w-8]': 'size() === "xs"',
    '[class.w-12]': 'size() === "sm"',
    '[class.w-16]': 'size() === "md"',
    '[class.w-20]': 'size() === "lg"',
    '[class.w-24]': 'size() === "xl"',

    '[class.rounded-none]': 'shape() === "square"',
    '[class.rounded-xl]': 'shape() === "rounded"',
    '[class.rounded-full]': 'shape() === "circle"',

    '[class.mask]': 'isMask()',

    '[class.mask-squircle]': 'shape() === "squircle"',
    '[class.mask-heart]': 'shape() === "heart"',
    '[class.mask-hexagon]': 'shape() === "hexagon"',
    '[class.mask-hexagon-2]': 'shape() === "hexagon-2"',
    '[class.mask-decagon]': 'shape() === "decagon"',
    '[class.mask-pentagon]': 'shape() === "pentagon"',
    '[class.mask-diamond]': 'shape() === "diamond"',
    '[class.mask-square]': 'shape() === "mask-square"',
    '[class.mask-circle]': 'shape() === "mask-circle"',
    '[class.mask-star]': 'shape() === "star"',
    '[class.mask-star-2]': 'shape() === "star-2"',
    '[class.mask-triangle]': 'shape() === "triangle"',
    '[class.mask-triangle-2]': 'shape() === "triangle-2"',
    '[class.mask-triangle-3]': 'shape() === "triangle-3"',
    '[class.mask-triangle-4]': 'shape() === "triangle-4"',

    '[class.mask-half-1]': 'maskHalf() === "first"',
    '[class.mask-half-2]': 'maskHalf() === "second"',
  },
})
export class AvatarContent {
  public readonly size: InputSignal<AvatarSize> = input<AvatarSize>('md');
  public readonly shape: InputSignal<AvatarShape> = input<AvatarShape>('rounded');
  public readonly maskHalf: InputSignal<AvatarMaskHalf | null> = input<AvatarMaskHalf | null>(null);

  protected readonly isMask: Signal<boolean> = computed((): boolean => !['square', 'rounded', 'circle'].includes(this.shape()));
}

@Directive({
  selector: '[suiAvatarGroup]',
  standalone: true,
  host: {
    class: 'avatar-group sui-avatar-group',
  },
})
export class AvatarGroup {}
