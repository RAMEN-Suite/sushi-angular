import { Component, signal, Signal, viewChild, WritableSignal } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';
import { afterEach, describe, expect, it } from 'vitest';
import { query, render } from '../../../../testing/test-utils';
import { MultiSelect } from '../multi-select.component';
import type { MultiSelectModelValue, MultiSelectOption } from '../multi-select.interfaces';
import { MultiSelectHeaderTemplate, MultiSelectItemTemplate, MultiSelectSelectedItemsTemplate } from '../multi-select.templates';

const options: readonly MultiSelectOption[] = [
  { label: 'Miso', value: 'miso' },
  { label: 'Shoyu', value: 'shoyu' },
  { label: 'Unavailable', value: 'disabled', disabled: true },
];

@Component({
  imports: [MultiSelect, MultiSelectHeaderTemplate, MultiSelectItemTemplate, MultiSelectSelectedItemsTemplate],
  template: `
    <sui-multi-select
      ariaLabel="Ramen styles"
      placeholder="Choose ramen"
      showClear
      showSelectAll
      required
      [disabled]="disabled()"
      [invalid]="invalid()"
      [loading]="loading()"
      [options]="options"
      [touched]="touched()"
      [(value)]="value"
      (touch)="touches += 1"
    >
      <ng-template suiMultiSelectSelectedItems let-selected>
        <span data-selected>{{ labels(selected) }}</span>
      </ng-template>
      <ng-template suiMultiSelectHeader let-selectedCount="selectedCount">
        <span data-selected-count>{{ selectedCount }}</span>
      </ng-template>
      <ng-template suiMultiSelectItem let-option let-index="index">
        <span [attr.data-index]="index">{{ option.label }}</span>
      </ng-template>
    </sui-multi-select>
  `,
})
class MultiSelectHost {
  public readonly control: Signal<MultiSelect> = viewChild.required(MultiSelect);
  public readonly disabled: WritableSignal<boolean> = signal<boolean>(false);
  public readonly invalid: WritableSignal<boolean> = signal<boolean>(false);
  public readonly loading: WritableSignal<boolean> = signal<boolean>(false);
  public readonly options: readonly MultiSelectOption[] = options;
  public readonly touched: WritableSignal<boolean> = signal<boolean>(false);
  public readonly value: WritableSignal<MultiSelectModelValue> = signal<MultiSelectModelValue>(['shoyu', 'miso']);
  public touches: number = 0;

  public labels(selected: readonly MultiSelectOption[]): string {
    return selected.map((option: MultiSelectOption): string => option.label).join(', ');
  }
}

afterEach((): void => document.querySelector('.cdk-overlay-container')?.remove());

describe('MultiSelect value and state', (): void => {
  it('renders selected options in option order and resets its model', (): void => {
    const fixture: ComponentFixture<MultiSelectHost> = render(MultiSelectHost);

    expect(query(fixture, '[data-selected]').textContent).toBe('Miso, Shoyu');
    fixture.componentInstance.control().reset();
    fixture.detectChanges();

    expect(fixture.componentInstance.value()).toEqual([]);
    expect(query(fixture, '[data-selected]').textContent).toBe('');
  });

  it('clears all values through the clear action', (): void => {
    const fixture: ComponentFixture<MultiSelectHost> = render(MultiSelectHost);
    query(fixture, '[aria-label="Clear selection"]').dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));
    fixture.detectChanges();

    expect(fixture.componentInstance.value()).toEqual([]);
  });

  it('exposes required, selection count, and delayed invalid state', async (): Promise<void> => {
    const fixture: ComponentFixture<MultiSelectHost> = render(MultiSelectHost);
    const combobox: HTMLElement = query(fixture, 'div');
    fixture.componentInstance.invalid.set(true);
    combobox.click();
    await fixture.whenStable();

    expect(combobox.getAttribute('aria-required')).toBe('true');
    expect(combobox.hasAttribute('aria-invalid')).toBe(false);
    expect(document.querySelector('[data-selected-count]')?.textContent).toBe('2');

    fixture.componentInstance.touched.set(true);
    fixture.detectChanges();
    expect(combobox.getAttribute('aria-invalid')).toBe('true');
  });
});

describe('MultiSelect interaction', (): void => {
  it('selects all enabled options and excludes disabled options', async (): Promise<void> => {
    const fixture: ComponentFixture<MultiSelectHost> = render(MultiSelectHost);
    fixture.componentInstance.value.set([]);
    fixture.detectChanges();
    query(fixture, 'div').dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await fixture.whenStable();

    const selectAll: HTMLInputElement | null = document.querySelector<HTMLInputElement>('input[type="checkbox"]');
    if (selectAll === null) throw new Error('Expected the select-all control.');
    selectAll.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.value()).toEqual(['miso', 'shoyu']);
  });

  it('keeps disabled controls focusable and closed', (): void => {
    const fixture: ComponentFixture<MultiSelectHost> = render(MultiSelectHost);
    const combobox: HTMLElement = query(fixture, 'div');
    fixture.componentInstance.disabled.set(true);
    fixture.detectChanges();

    fixture.componentInstance.control().focus();
    combobox.click();
    fixture.detectChanges();

    expect(document.activeElement).toBe(combobox);
    expect(combobox.getAttribute('aria-disabled')).toBe('true');
    expect(document.querySelector('[role="listbox"]')).toBeNull();
    const root: HTMLElement = fixture.nativeElement as HTMLElement;
    expect(root.querySelector('[aria-label="Clear selection"]')).toBeNull();
  });
});
