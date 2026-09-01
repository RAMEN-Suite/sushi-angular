import { NgTemplateOutlet } from '@angular/common';
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  contentChild,
  input,
  InputSignal,
  InputSignalWithTransform,
  Signal,
  TemplateRef,
} from '@angular/core';
import { ListItemContext, ListSize, ListTrackBy } from './list.interfaces';
import { ListItemTemplate } from './list.templates';

/** Renders a typed collection as a native list with consumer-defined rows. */
@Component({
  selector: 'sui-list',
  imports: [NgTemplateOutlet],
  templateUrl: './list.component.html',
  styleUrl: './list.component.css',
  host: { class: 'sui-list block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class List<T> {
  /** Collection rendered in source order. */
  public readonly items: InputSignal<readonly T[]> = input.required<readonly T[]>();
  /** Returns a stable identity for one item. */
  public readonly trackBy: InputSignal<ListTrackBy<T>> = input<ListTrackBy<T>>((_index: number, item: T): T => item);
  /** Accessible name applied to the native list. */
  public readonly ariaLabel: InputSignal<string | null> = input<string | null>(null);
  /** ID reference that names the native list. */
  public readonly ariaLabelledby: InputSignal<string | null> = input<string | null>(null);
  /** Controls the spacing within generated rows. */
  public readonly size: InputSignal<ListSize> = input<ListSize>('md');
  /** Draws subtle separators between adjacent rows. */
  public readonly dividers: InputSignalWithTransform<boolean, unknown> = input(true, { transform: booleanAttribute });

  protected readonly itemTemplate: Signal<TemplateRef<ListItemContext<T>>> = contentChild.required(ListItemTemplate, {
    read: TemplateRef,
  });

  protected trackItem(index: number, item: T): unknown {
    return this.trackBy()(index, item);
  }

  protected itemContext(item: T, index: number, count: number): ListItemContext<T> {
    return {
      $implicit: item,
      item,
      index,
      count,
      first: index === 0,
      last: index === count - 1,
      even: index % 2 === 0,
      odd: index % 2 !== 0,
    };
  }
}
