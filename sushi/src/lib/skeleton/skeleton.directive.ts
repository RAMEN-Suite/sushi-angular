import { booleanAttribute, Directive, input, InputSignal, InputSignalWithTransform } from '@angular/core';
import { SkeletonVariant } from './skeleton.interfaces';

/** Marks a non-interactive placeholder for content that is still loading. */
@Directive({
  selector: '[suiSkeleton]',
  host: {
    class: 'skeleton sui-skeleton',
    '[class.sui-skeleton--static]': '!animated()',
    '[class.skeleton-text]': 'variant() === "text"',
    '[class.sui-skeleton--text]': 'variant() === "text"',
    '[attr.aria-hidden]': 'true',
  },
})
export class Skeleton {
  /** Selects a block placeholder or animated placeholder text. */
  public readonly variant: InputSignal<SkeletonVariant> = input<SkeletonVariant>('block');
  /** Enables the loading animation. Disable it when motion would distract from the surrounding task. */
  public readonly animated: InputSignalWithTransform<boolean, unknown> = input(true, { transform: booleanAttribute });
}
