import { Component, signal, Signal, viewChild, WritableSignal } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';
import { afterEach, describe, expect, it } from 'vitest';
import { query, render } from '../../../../testing/test-utils';
import { MultiSelect } from '../multi-select.component';
import type { MultiSelectModelValue, MultiSelectOption } from '../multi-select.interfaces';
import {
  MultiSelectCheckmarkIconTemplate,
  MultiSelectClearIconTemplate,
  MultiSelectDropdownIconTemplate,
  MultiSelectEmptyTemplate,
  MultiSelectFooterTemplate,
  MultiSelectGroupTemplate,
  MultiSelectHeaderTemplate,
  MultiSelectItemTemplate,
  MultiSelectLoadingIconTemplate,
  MultiSelectLoadingTemplate,
  MultiSelectSelectedItemsTemplate,
} from '../multi-select.templates';

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
      <ng-template suiMultiSelectSelectedItems let-selected let-remove="remove">
        <span data-selected>{{ labels(selected) }}</span>
        @if (selected[0]) {
          <button data-remove type="button" (click)="remove(selected[0])">Remove first</button>
        }
      </ng-template>
      <ng-template suiMultiSelectHeader let-selectedCount="selectedCount" let-toggleAll="toggleAll">
        <span data-selected-count>{{ selectedCount }}</span>
        <button data-toggle-all type="button" (click)="toggleAll()">Toggle all</button>
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

@Component({
  imports: [
    MultiSelect,
    MultiSelectCheckmarkIconTemplate,
    MultiSelectClearIconTemplate,
    MultiSelectDropdownIconTemplate,
    MultiSelectEmptyTemplate,
    MultiSelectFooterTemplate,
    MultiSelectGroupTemplate,
    MultiSelectLoadingIconTemplate,
    MultiSelectLoadingTemplate,
  ],
  template: `
    <sui-multi-select showClear [loading]="loading()" [options]="options()" [(value)]="value">
      <ng-template suiMultiSelectFooter><span data-footer>Footer</span></ng-template>
      <ng-template suiMultiSelectEmpty><span data-empty>Nothing here</span></ng-template>
      <ng-template suiMultiSelectGroup let-group let-index="index"
        ><span [attr.data-group]="index">{{ group }}</span></ng-template
      >
      <ng-template suiMultiSelectLoading let-message
        ><span data-loading>{{ message }}</span></ng-template
      >
      <ng-template suiMultiSelectLoadingIcon><span data-loading-icon></span></ng-template>
      <ng-template suiMultiSelectDropdownIcon><span data-dropdown-icon></span></ng-template>
      <ng-template suiMultiSelectClearIcon><span data-clear-icon></span></ng-template>
      <ng-template suiMultiSelectCheckmarkIcon><span data-checkmark-icon></span></ng-template>
    </sui-multi-select>
  `,
})
class MultiSelectTemplatesHost {
  public readonly loading: WritableSignal<boolean> = signal<boolean>(false);
  public readonly options: WritableSignal<readonly MultiSelectOption[]> = signal<readonly MultiSelectOption[]>([
    { label: 'Miso', value: 'miso', group: 'Soup' },
    { label: 'Shoyu', value: 'shoyu', group: 'Soup' },
  ]);
  public readonly value: WritableSignal<MultiSelectModelValue> = signal<MultiSelectModelValue>(['miso']);
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

  it('removes selected values and toggles all through template callbacks', async (): Promise<void> => {
    const fixture: ComponentFixture<MultiSelectHost> = render(MultiSelectHost);
    query(fixture, '[data-remove]').dispatchEvent(new MouseEvent('click', { bubbles: true }));
    fixture.detectChanges();
    expect(fixture.componentInstance.value()).toEqual(['shoyu']);

    await fixture.whenStable();
    document.querySelector<HTMLElement>('[data-toggle-all]')?.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.value()).toEqual(['miso', 'shoyu']);
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

  it('hard-disables controls and keeps them closed', (): void => {
    const fixture: ComponentFixture<MultiSelectHost> = render(MultiSelectHost);
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
    const root: HTMLElement = fixture.nativeElement as HTMLElement;
    expect(root.querySelector('[aria-label="Clear selection"]')).toBeNull();
  });
});

describe('MultiSelect extension surfaces', (): void => {
  it('renders default selected text and structural templates', async (): Promise<void> => {
    const fixture: ComponentFixture<MultiSelectTemplatesHost> = render(MultiSelectTemplatesHost);
    expect(query(fixture, '[role="combobox"]').textContent).toContain('Miso');
    expect(query(fixture, '[data-clear-icon]')).toBeTruthy();
    expect(query(fixture, '[data-dropdown-icon]')).toBeTruthy();

    query(fixture, '[role="combobox"]').dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await fixture.whenStable();

    expect(document.querySelector('[data-footer]')).toBeTruthy();
    expect(document.querySelector('[data-group="0"]')?.textContent).toBe('Soup');
    expect(document.querySelector('[data-checkmark-icon]')).toBeTruthy();
  });

  it('renders custom empty and loading states', async (): Promise<void> => {
    const fixture: ComponentFixture<MultiSelectTemplatesHost> = render(MultiSelectTemplatesHost);
    const combobox: Element = query(fixture, '[role="combobox"]');
    fixture.componentInstance.options.set([]);
    fixture.componentInstance.value.set([]);
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
