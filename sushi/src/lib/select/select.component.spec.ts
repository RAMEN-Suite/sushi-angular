import { Component, signal, Signal, viewChild, WritableSignal } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';
import { afterEach, describe, expect, it } from 'vitest';
import { query, render } from '../../../testing/test-utils';
import { Select } from './select.component';
import type { SelectModelValue, SelectOption } from './select.interfaces';
import { SelectItemTemplate, SelectSelectedItemTemplate } from './select.templates';

const options: readonly SelectOption[] = [
  { label: 'Miso', value: 'miso' },
  { label: 'Shoyu', value: 'shoyu' },
  { label: 'Unavailable', value: 'disabled', disabled: true },
];

@Component({
  imports: [Select, SelectItemTemplate, SelectSelectedItemTemplate],
  template: `
    <sui-select
      ariaLabel="Ramen style"
      placeholder="Choose ramen"
      showClear
      checkmark
      required
      [disabled]="disabled()"
      [invalid]="invalid()"
      [loading]="loading()"
      [options]="options"
      [touched]="touched()"
      [(value)]="value"
      (touch)="touches += 1"
    >
      <ng-template suiSelectSelectedItem let-option
        ><strong data-selected>{{ option.label }}</strong></ng-template
      >
      <ng-template suiSelectItem let-option let-index="index"
        ><span [attr.data-index]="index">{{ option.label }}</span></ng-template
      >
    </sui-select>
  `,
})
class SelectHost {
  public readonly control: Signal<Select> = viewChild.required(Select);
  public readonly disabled: WritableSignal<boolean> = signal<boolean>(false);
  public readonly invalid: WritableSignal<boolean> = signal<boolean>(false);
  public readonly loading: WritableSignal<boolean> = signal<boolean>(false);
  public readonly options: readonly SelectOption[] = options;
  public readonly touched: WritableSignal<boolean> = signal<boolean>(false);
  public readonly value: WritableSignal<SelectModelValue> = signal<SelectModelValue>('shoyu');
  public touches: number = 0;
}

afterEach((): void => document.querySelector('.cdk-overlay-container')?.remove());

describe('Select value and state', (): void => {
  it('renders and resets the selected value through its model', (): void => {
    const fixture: ComponentFixture<SelectHost> = render(SelectHost);

    expect(query(fixture, '[data-selected]').textContent).toBe('Shoyu');
    fixture.componentInstance.control().reset();
    fixture.detectChanges();

    expect(fixture.componentInstance.value()).toBeNull();
    expect(query(fixture, '.grow').textContent.trim()).toBe('Choose ramen');
  });

  it('clears a value through the keyboard-accessible clear action', (): void => {
    const fixture: ComponentFixture<SelectHost> = render(SelectHost);
    const clear: Element = query(fixture, '[aria-label="Clear selection"]');
    clear.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    fixture.detectChanges();

    expect(fixture.componentInstance.value()).toBeNull();
  });

  it('exposes required and delayed invalid state', (): void => {
    const fixture: ComponentFixture<SelectHost> = render(SelectHost);
    const combobox: Element = query(fixture, '[role="combobox"]');
    fixture.componentInstance.invalid.set(true);
    fixture.detectChanges();

    expect(combobox.getAttribute('aria-required')).toBe('true');
    expect(combobox.hasAttribute('aria-invalid')).toBe(false);

    fixture.componentInstance.touched.set(true);
    fixture.detectChanges();
    expect(combobox.getAttribute('aria-invalid')).toBe('true');
  });
});

describe('Select interaction', (): void => {
  it('keeps disabled controls focusable without opening', (): void => {
    const fixture: ComponentFixture<SelectHost> = render(SelectHost);
    const combobox: HTMLElement = query(fixture, 'div');
    fixture.componentInstance.disabled.set(true);
    fixture.detectChanges();

    fixture.componentInstance.control().focus();
    combobox.click();
    fixture.detectChanges();

    expect(document.activeElement).toBe(combobox);
    expect(combobox.getAttribute('aria-disabled')).toBe('true');
    expect(document.querySelector('[role="listbox"]')).toBeNull();
  });

  it('opens options and selects an enabled item', async (): Promise<void> => {
    const fixture: ComponentFixture<SelectHost> = render(SelectHost);
    const combobox: HTMLElement = query(fixture, 'div');
    combobox.click();
    await fixture.whenStable();

    const items: NodeListOf<HTMLElement> = document.querySelectorAll<HTMLElement>('[role="option"]');
    expect(items).toHaveLength(3);
    expect(items[2].getAttribute('aria-disabled')).toBe('true');

    items[0].click();
    fixture.detectChanges();
    expect(fixture.componentInstance.value()).toBe('miso');
    expect(fixture.componentInstance.touches).toBe(1);
  });
});
