import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  InputSignal,
  InputSignalWithTransform,
  Signal,
} from '@angular/core';
import { AvatarMaskHalf, AvatarShape, AvatarSize, AvatarStatus } from './avatar.interfaces';
import { Mask, MaskShape } from '../mask';

@Component({
  selector: 'sui-avatar',
  imports: [Mask],
  templateUrl: './avatar.component.html',
  host: {
    class: 'avatar sui-avatar',
    '[class.avatar-placeholder]': 'placeholder()',
    '[class.avatar-online]': 'status() === "online"',
    '[class.avatar-offline]': 'status() === "offline"',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
/** Displays an image or fallback identity with optional presence state and masking. */
export class Avatar {
  /** Displays an online or offline presence marker. */
  public readonly status: InputSignal<AvatarStatus | null> = input<AvatarStatus | null>(null);
  /** Controls the avatar dimensions. */
  public readonly size: InputSignal<AvatarSize> = input<AvatarSize>('md');
  /** Controls the frame or decorative mask. */
  public readonly shape: InputSignal<AvatarShape> = input<AvatarShape>('rounded');
  /** Displays only one half of a decorative mask. */
  public readonly maskHalf: InputSignal<AvatarMaskHalf | null> = input<AvatarMaskHalf | null>(null);
  /** Marks projected content as a fallback instead of an image. */
  public readonly placeholder: InputSignalWithTransform<boolean, unknown> = input<boolean, unknown>(false, {
    transform: booleanAttribute,
  });

  protected readonly maskShape: Signal<MaskShape | null> = computed((): MaskShape | null => {
    const shape: AvatarShape = this.shape();
    if (shape === 'square' || shape === 'rounded' || shape === 'circle') return null;
    if (shape === 'mask-square') return 'square';
    if (shape === 'mask-circle') return 'circle';
    return shape;
  });
}
