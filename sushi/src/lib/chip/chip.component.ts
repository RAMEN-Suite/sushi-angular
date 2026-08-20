import { NgTemplateOutlet } from '@angular/common';
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  input,
  InputSignal,
  InputSignalWithTransform,
  output,
  OutputEmitterRef,
  signal,
  Signal,
  TemplateRef,
  WritableSignal,
} from '@angular/core';
import { LucideX } from '@lucide/angular';
import { ChipContentContext, ChipSeverity, ChipSize, ChipVariant } from './chip.interfaces';
import { ChipContentTemplate, ChipRemoveIconTemplate } from './chip.templates';

/** Displays a compact value that can optionally be removed. */
@Component({
  selector: 'sui-chip',
  imports: [NgTemplateOutlet, LucideX],
  templateUrl: './chip.component.html',
  styleUrl: './chip.component.css',
  host: {
    class: 'badge sui-chip',
    '[class.badge-primary]': 'severity() === "primary"',
    '[class.badge-secondary]': 'severity() === "secondary"',
    '[class.badge-neutral]': 'severity() === "neutral"',
    '[class.badge-accent]': 'severity() === "accent"',
    '[class.badge-info]': 'severity() === "info"',
    '[class.badge-success]': 'severity() === "success"',
    '[class.badge-warning]': 'severity() === "warning"',
    '[class.badge-error]': 'severity() === "error"',
    '[class.badge-outline]': 'variant() === "outlined"',
    '[class.badge-soft]': 'variant() === "soft"',
    '[class.badge-dash]': 'variant() === "dash"',
    '[class.sui-chip--disabled]': 'disabled()',
    '[class.sui-chip--xs]': 'size() === "xs"',
    '[class.sui-chip--sm]': 'size() === "sm"',
    '[class.sui-chip--lg]': 'size() === "lg"',
    '[class.sui-chip--xl]': 'size() === "xl"',
    '[class.hidden]': 'removed()',
    '[attr.tabindex]': 'removable() && !disabled() && !removed() ? 0 : null',
    '[attr.aria-label]': 'computedAriaLabel()',
    '[attr.aria-labelledby]': 'ariaLabelledby()',
    '[attr.aria-disabled]': 'disabled() || null',
    '(keydown.enter)': 'handleRemove($event)',
    '(keydown.space)': 'handleRemove($event)',
    '(keydown.backspace)': 'handleRemove($event)',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Chip {
  /** Text displayed by the chip and used as its accessible label. */
  public readonly label: InputSignal<string | null> = input<string | null>(null);
  /** Accessible name overriding the label-derived default. */
  public readonly ariaLabel: InputSignal<string | null> = input<string | null>(null);
  /** IDs of elements that label the chip. */
  public readonly ariaLabelledby: InputSignal<string | null> = input<string | null>(null);
  /** Allows pointer and keyboard removal. */
  public readonly removable: InputSignalWithTransform<boolean, unknown> = input(false, { transform: booleanAttribute });
  /** Prevents removal and applies disabled styling. */
  public readonly disabled: InputSignalWithTransform<boolean, unknown> = input(false, { transform: booleanAttribute });
  /** Controls chip height, spacing, and text size. */
  public readonly size: InputSignal<ChipSize> = input<ChipSize>('md');
  /** Controls the semantic color of the chip. */
  public readonly severity: InputSignal<ChipSeverity | null> = input<ChipSeverity | null>(null);
  /** Controls the visual treatment of the selected severity. */
  public readonly variant: InputSignal<ChipVariant | null> = input<ChipVariant | null>(null);

  /** Emits when the chip is removed by pointer or keyboard. */
  public readonly remove: OutputEmitterRef<Event> = output<Event>();
  protected readonly contentTemplate: Signal<TemplateRef<ChipContentContext> | undefined> = contentChild(ChipContentTemplate, {
    read: TemplateRef,
  });
  protected readonly removeIconTemplate: Signal<TemplateRef<void> | undefined> = contentChild(ChipRemoveIconTemplate, {
    read: TemplateRef,
  });
  protected readonly contentContext: Signal<ChipContentContext> = computed(() => ({
    $implicit: this.label(),
    label: this.label(),
    removable: this.removable(),
    disabled: this.disabled(),
  }));
  protected readonly computedAriaLabel: Signal<string | null> = computed(() => {
    if (this.ariaLabelledby()) return null;
    if (this.ariaLabel()) return this.ariaLabel();
    return this.removable() ? `Remove ${this.label() ?? 'chip'}` : this.label();
  });
  protected readonly removed: WritableSignal<boolean> = signal(false);

  protected handleRemove(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    if (!this.removable() || this.disabled() || this.removed()) return;
    this.removed.set(true);
    this.remove.emit(event);
  }
}
