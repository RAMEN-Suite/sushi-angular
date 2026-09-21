import { Component, signal, Signal, viewChild, WritableSignal } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';
import { afterEach, describe, expect, it } from 'vitest';
import { query, render } from '../../../../testing/test-utils';
import { Select } from '../select.component';
import type { SelectModelValue, SelectOption } from '../select.interfaces';
import {
  SelectCheckmarkIconTemplate,
  SelectClearIconTemplate,
  SelectDropdownIconTemplate,
  SelectEmptyTemplate,
  SelectFooterTemplate,
  SelectGroupTemplate,
  SelectHeaderTemplate,
  SelectItemTemplate,
  SelectLoadingIconTemplate,
  SelectLoadingTemplate,
  SelectSelectedItemTemplate,
} from '../select.templates';

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

@Component({
  imports: [
    Select,
    SelectCheckmarkIconTemplate,
    SelectClearIconTemplate,
    SelectDropdownIconTemplate,
    SelectEmptyTemplate,
    SelectFooterTemplate,
    SelectGroupTemplate,
    SelectHeaderTemplate,
    SelectLoadingIconTemplate,
    SelectLoadingTemplate,
  ],
  template: `
    <sui-select checkmark showClear [loading]="loading()" [options]="options()" [(value)]="value">
      <ng-template suiSelectHeader><span data-header>Header</span></ng-template>
      <ng-template suiSelectFooter><span data-footer>Footer</span></ng-template>
      <ng-template suiSelectEmpty><span data-empty>Nothing here</span></ng-template>
      <ng-template suiSelectGroup let-group let-index="index"
        ><span [attr.data-group]="index">{{ group }}</span></ng-template
      >
      <ng-template suiSelectLoading let-message
        ><span data-loading>{{ message }}</span></ng-template
      >
      <ng-template suiSelectLoadingIcon><span data-loading-icon></span></ng-template>
      <ng-template suiSelectDropdownIcon><span data-dropdown-icon></span></ng-template>
      <ng-template suiSelectClearIcon><span data-clear-icon></span></ng-template>
      <ng-template suiSelectCheckmarkIcon><span data-checkmark-icon></span></ng-template>
    </sui-select>
  `,
})
class SelectTemplatesHost {
  public readonly loading: WritableSignal<boolean> = signal<boolean>(false);
  public readonly options: WritableSignal<readonly SelectOption[]> = signal<readonly SelectOption[]>([
    { label: 'Miso', value: 'miso', group: 'Soup' },
    { label: 'Shoyu', value: 'shoyu', group: 'Soup' },
  ]);
  public readonly value: WritableSignal<SelectModelValue> = signal<SelectModelValue>('miso');
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
  it('focuses the combobox through its public method', (): void => {
    const fixture: ComponentFixture<SelectHost> = render(SelectHost);
    const combobox: Element = query(fixture, '[role="combobox"]');

    fixture.componentInstance.control().focus();

    expect(document.activeElement).toBe(combobox);
  });

  it('hard-disables controls without opening', (): void => {
    const fixture: ComponentFixture<SelectHost> = render(SelectHost);
    const combobox: HTMLElement = query(fixture, 'div');
    fixture.componentInstance.disabled.set(true);
    fixture.detectChanges();

    fixture.componentInstance.control().focus();
    combobox.click();
    fixture.detectChanges();

    expect(combobox.tabIndex).toBe(-1);
    expect(combobox.classList.contains('pointer-events-none')).toBe(true);
    expect(combobox.getAttribute('aria-disabled')).toBe('true');
    expect(document.querySelector('[role="listbox"]')).toBeNull();
  });

  it('does not open while loading', async (): Promise<void> => {
    const fixture: ComponentFixture<SelectHost> = render(SelectHost);
    fixture.componentInstance.loading.set(true);
    fixture.detectChanges();

    query(fixture, '[role="combobox"]').dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await fixture.whenStable();

    expect(document.querySelector('[role="listbox"]')).toBeNull();
    expect(fixture.componentInstance.value()).toBe('shoyu');
  });
});

describe('Select option selection', (): void => {
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

  it('keeps the selection when a disabled option is clicked', async (): Promise<void> => {
    const fixture: ComponentFixture<SelectHost> = render(SelectHost);
    query(fixture, '[role="combobox"]').dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await fixture.whenStable();

    document.querySelectorAll<HTMLElement>('[role="option"]')[2].click();
    fixture.detectChanges();

    expect(fixture.componentInstance.value()).toBe('shoyu');
    expect(fixture.componentInstance.touches).toBe(0);
  });
});

describe('Select extension surfaces', (): void => {
  it('renders structural and icon templates in their owned regions', async (): Promise<void> => {
    const fixture: ComponentFixture<SelectTemplatesHost> = render(SelectTemplatesHost);
    expect(query(fixture, '[data-clear-icon]')).toBeTruthy();
    expect(query(fixture, '[data-dropdown-icon]')).toBeTruthy();

    query(fixture, '[role="combobox"]').dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await fixture.whenStable();

    expect(document.querySelector('[data-header]')).toBeTruthy();
    expect(document.querySelector('[data-footer]')).toBeTruthy();
    expect(document.querySelector('[data-group="0"]')?.textContent).toBe('Soup');
    expect(document.querySelector('[data-checkmark-icon]')).toBeTruthy();
  });

  it('renders custom empty and loading states', async (): Promise<void> => {
    const fixture: ComponentFixture<SelectTemplatesHost> = render(SelectTemplatesHost);
    const combobox: Element = query(fixture, '[role="combobox"]');
    fixture.componentInstance.options.set([]);
    fixture.componentInstance.value.set(null);
    fixture.detectChanges();
    combobox.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await fixture.whenStable();
    expect(document.querySelector('[data-empty]')).toBeTruthy();

    fixture.componentInstance.loading.set(true);
    fixture.detectChanges();
    expect(query(fixture, '[data-loading-icon]')).toBeTruthy();
    expect(document.querySelector('[data-loading]')).toBeTruthy();
  });
});
