import { NgTemplateOutlet } from '@angular/common';
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  contentChild,
  input,
  InputSignal,
  InputSignalWithTransform,
  model,
  ModelSignal,
  output,
  OutputEmitterRef,
  Signal,
  TemplateRef,
} from '@angular/core';
import { FormValueControl } from '@angular/forms/signals';
import { Button } from '../button';
import { JoinItem } from '../join';
import {
  SelectButtonOption,
  SelectButtonOptionContext,
  SelectButtonOrientation,
  SelectButtonSeverity,
  SelectButtonSize,
  SelectButtonValue,
} from './select-button.interfaces';
import { SelectButtonOptionTemplate } from './select-button.templates';

const HORIZONTAL_KEYS: Readonly<Partial<Record<string, number>>> = { ArrowLeft: -1, ArrowRight: 1 };
const VERTICAL_KEYS: Readonly<Partial<Record<string, number>>> = { ArrowDown: 1, ArrowUp: -1 };

/** Selects one value from a visible group of joined buttons. */
@Component({
  selector: 'sui-select-button',
  imports: [NgTemplateOutlet, Button, JoinItem],
  templateUrl: './select-button.component.html',
  host: {
    class: 'join sui-select-button',
    role: 'radiogroup',
    '[class.join-horizontal]': 'orientation() === "horizontal"',
    '[class.join-vertical]': 'orientation() === "vertical"',
    '[class.cursor-not-allowed]': 'disabled()',
    '[attr.aria-label]': 'ariaLabel()',
    '[attr.aria-labelledby]': 'ariaLabelledby()',
    '[attr.aria-orientation]': 'orientation()',
    '[attr.aria-disabled]': 'disabled() || null',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectButton implements FormValueControl<SelectButtonValue | null> {
  /** Selected option value or `null` when empty selection is allowed. */
  public readonly value: ModelSignal<SelectButtonValue | null> = model<SelectButtonValue | null>(null);

  /** Visible options rendered as a single radio group. */
  public readonly options: InputSignal<readonly SelectButtonOption[]> = input.required<readonly SelectButtonOption[]>();

  /** Applies one semantic color to every option in the group. */
  public readonly severity: InputSignal<SelectButtonSeverity> = input<SelectButtonSeverity>('neutral');
  /** Sets every option to the same dimensions. */
  public readonly size: InputSignal<SelectButtonSize> = input<SelectButtonSize>('md');
  /** Controls layout and arrow-key direction. */
  public readonly orientation: InputSignal<SelectButtonOrientation> = input<SelectButtonOrientation>('horizontal');

  /** Accessible label used when no visible group label is available. */
  public readonly ariaLabel: InputSignal<string | null> = input<string | null>(null);
  /** ID of the element that labels the radio group. */
  public readonly ariaLabelledby: InputSignal<string | null> = input<string | null>(null);

  /** Allows the active option to clear itself when selected again. */
  public readonly allowEmpty: InputSignalWithTransform<boolean, unknown> = input<boolean, unknown>(false, {
    transform: booleanAttribute,
  });
  /** Prevents selection while keeping the current option focusable. */
  public readonly disabled: InputSignalWithTransform<boolean, unknown> = input<boolean, unknown>(false, {
    transform: booleanAttribute,
  });

  /** Emits after a pointer or keyboard selection completes. */
  public readonly touch: OutputEmitterRef<void> = output();

  protected readonly optionTemplate: Signal<TemplateRef<SelectButtonOptionContext> | undefined> = contentChild(
    SelectButtonOptionTemplate,
    {
      read: TemplateRef,
    },
  );

  protected isDisabled(option: SelectButtonOption): boolean {
    return this.disabled() || Boolean(option.disabled);
  }

  protected isSelected(option: SelectButtonOption): boolean {
    return Object.is(option.value, this.value());
  }

  protected optionContext(option: SelectButtonOption, index: number): SelectButtonOptionContext {
    return {
      $implicit: option,
      option,
      selected: this.isSelected(option),
      disabled: this.isDisabled(option),
      index,
    };
  }

  protected isTabStop(option: SelectButtonOption, index: number): boolean {
    if (this.isSelected(option)) return true;
    return this.value() === null && index === 0;
  }

  protected handleSelection(option: SelectButtonOption): void {
    if (this.isDisabled(option)) return;
    const nextValue: SelectButtonValue | null = this.allowEmpty() && this.isSelected(option) ? null : option.value;
    this.value.set(nextValue);
    this.touch.emit();
  }

  protected handleKeydown(event: KeyboardEvent, index: number): void {
    const keys: Readonly<Partial<Record<string, number>>> = this.orientation() === 'vertical' ? VERTICAL_KEYS : HORIZONTAL_KEYS;
    const direction: number | undefined = keys[event.key];
    const edge: number | undefined = event.key === 'Home' ? 0 : event.key === 'End' ? this.options().length - 1 : undefined;
    if (direction === undefined && edge === undefined) return;
    event.preventDefault();

    const options: readonly SelectButtonOption[] = this.options();
    const nextIndex: number = edge ?? (index + (direction ?? 0) + options.length) % options.length;

    const target: EventTarget | null = event.currentTarget;
    if (!(target instanceof HTMLElement)) return;
    const parent: HTMLElement | null = target.parentElement;
    if (!parent) return;
    const buttons: NodeListOf<HTMLButtonElement> = parent.querySelectorAll('button[role="radio"]');
    buttons.item(nextIndex).focus();
    this.handleSelection(options[nextIndex]);
  }
}
