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

@Component({
  selector: 'sui-avatar',
  templateUrl: './avatar.component.html',
  host: {
    class: 'avatar sui-avatar',
    '[class.avatar-placeholder]': 'placeholder()',
    '[class.avatar-online]': 'status() === "online"',
    '[class.avatar-offline]': 'status() === "offline"',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Avatar {
  public readonly status: InputSignal<AvatarStatus | null> = input<AvatarStatus | null>(null);
  public readonly size: InputSignal<AvatarSize> = input<AvatarSize>('md');
  public readonly shape: InputSignal<AvatarShape> = input<AvatarShape>('rounded');
  public readonly maskHalf: InputSignal<AvatarMaskHalf | null> = input<AvatarMaskHalf | null>(null);
  public readonly placeholder: InputSignalWithTransform<boolean, unknown> = input<boolean, unknown>(false, {
    transform: booleanAttribute,
  });

  protected readonly isMask: Signal<boolean> = computed((): boolean => !['square', 'rounded', 'circle'].includes(this.shape()));
}
