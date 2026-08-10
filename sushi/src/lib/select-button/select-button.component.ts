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

@Component({
  selector: 'sui-select-button',
  imports: [NgTemplateOutlet, Button, JoinItem],
  templateUrl: './select-button.component.html',
  host: {
    class: 'join sui-select-button',
    role: 'radiogroup',
    '[class.join-horizontal]': 'orientation() === "horizontal"',
    '[class.join-vertical]': 'orientation() === "vertical"',
    '[attr.aria-label]': 'ariaLabel()',
    '[attr.aria-labelledby]': 'ariaLabelledby()',
    '[attr.aria-orientation]': 'orientation()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectButton implements FormValueControl<SelectButtonValue | null> {
  public readonly value: ModelSignal<SelectButtonValue | null> = model<SelectButtonValue | null>(null);

  public readonly options: InputSignal<readonly SelectButtonOption[]> = input.required<readonly SelectButtonOption[]>();

  public readonly severity: InputSignal<SelectButtonSeverity> = input<SelectButtonSeverity>('neutral');
  public readonly size: InputSignal<SelectButtonSize> = input<SelectButtonSize>('md');
  public readonly orientation: InputSignal<SelectButtonOrientation> = input<SelectButtonOrientation>('horizontal');

  public readonly ariaLabel: InputSignal<string | null> = input<string | null>(null);
  public readonly ariaLabelledby: InputSignal<string | null> = input<string | null>(null);

  public readonly allowEmpty: InputSignalWithTransform<boolean, unknown> = input<boolean, unknown>(false, {
    transform: booleanAttribute,
  });
  public readonly disabled: InputSignalWithTransform<boolean, unknown> = input<boolean, unknown>(false, {
    transform: booleanAttribute,
  });

  public readonly touch: OutputEmitterRef<void> = output();

  protected readonly optionTemplate: Signal<TemplateRef<SelectButtonOptionContext> | undefined> = contentChild(
    SelectButtonOptionTemplate,
    {
      read: TemplateRef,
    },
  );

  protected isDisabled(option?: SelectButtonOption): boolean {
    return this.disabled() || Boolean(option?.disabled);
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
    if (this.isDisabled(option)) return false;
    if (this.isSelected(option)) return true;
    return this.value() === null && this.options().findIndex((candidate): boolean => !this.isDisabled(candidate)) === index;
  }

  protected select(option: SelectButtonOption): void {
    if (this.isDisabled(option)) return;
    const nextValue: SelectButtonValue | null = this.allowEmpty() && this.isSelected(option) ? null : option.value;
    this.value.set(nextValue);
    this.touch.emit();
  }

  protected handleKeydown(event: KeyboardEvent, index: number): void {
    const direction: number =
      this.orientation() === 'vertical'
        ? event.key === 'ArrowDown'
          ? 1
          : event.key === 'ArrowUp'
            ? -1
            : 0
        : event.key === 'ArrowRight'
          ? 1
          : event.key === 'ArrowLeft'
            ? -1
            : 0;
    if (direction === 0 && event.key !== 'Home' && event.key !== 'End') return;
    event.preventDefault();

    const options: readonly SelectButtonOption[] = this.options();
    const enabled: number[] = options.reduce<number[]>((indices, option, optionIndex): number[] => {
      if (!this.isDisabled(option)) indices.push(optionIndex);
      return indices;
    }, []);
    if (enabled.length === 0) return;

    const position: number = enabled.indexOf(index);
    const next: number =
      event.key === 'Home'
        ? 0
        : event.key === 'End'
          ? enabled.length - 1
          : (position + direction + enabled.length) % enabled.length;
    const nextIndex: number = enabled[next];

    const target: EventTarget | null = event.currentTarget;
    if (!(target instanceof HTMLElement)) return;
    const parent: HTMLElement | null = target.parentElement;
    if (!parent) return;
    const buttons: NodeListOf<HTMLButtonElement> = parent.querySelectorAll('button[role="radio"]');
    buttons.item(nextIndex).focus();
    this.select(options[nextIndex]);
  }
}
