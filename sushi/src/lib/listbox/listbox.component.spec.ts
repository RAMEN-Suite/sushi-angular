import { Component, signal, Signal, viewChild, WritableSignal } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { press, query, queryAll, render } from '../../../testing/test-utils';
import { Listbox } from './listbox.component';
import type { ListboxModelValue, ListboxOption } from './listbox.interfaces';
import { ListboxFilterTemplate, ListboxItemTemplate } from './listbox.templates';

const options: readonly ListboxOption[] = [
  { label: 'Miso', value: 'miso', group: 'Classic' },
  { label: 'Shoyu', value: 'shoyu', group: 'Classic' },
  { label: 'Sold out', value: 'sold-out', group: 'Seasonal', disabled: true },
  { label: 'Yuzu', value: 'yuzu', group: 'Seasonal' },
];

@Component({
  imports: [Listbox, ListboxFilterTemplate, ListboxItemTemplate],
  template: `
    <sui-listbox
      ariaLabel="Ramen styles"
      filter
      checkbox
      selectAll
      lazy
      required
      [multiple]="multiple()"
      [disabled]="disabled()"
      [readOnly]="readOnly()"
      [invalid]="invalid()"
      [loading]="loading()"
      [options]="options"
      [touched]="touched()"
      [(value)]="value"
      (loadMore)="offsets.push($event)"
      (touch)="touches += 1"
    >
      <ng-template suiListboxFilter let-query let-update="update">
        <input data-filter [value]="query" (input)="update($any($event.target).value)" />
      </ng-template>
      <ng-template suiListboxItem let-option let-selected="selected" let-disabled="disabled">
        <span [attr.data-item]="option.value" [attr.data-selected]="selected" [attr.data-disabled]="disabled">
          {{ option.label }}
        </span>
      </ng-template>
    </sui-listbox>
  `,
})
class ListboxHost {
  public readonly control: Signal<Listbox> = viewChild.required(Listbox);
  public readonly disabled: WritableSignal<boolean> = signal<boolean>(false);
  public readonly invalid: WritableSignal<boolean> = signal<boolean>(false);
  public readonly loading: WritableSignal<boolean> = signal<boolean>(false);
  public readonly multiple: WritableSignal<boolean> = signal<boolean>(true);
  public readonly readOnly: WritableSignal<boolean> = signal<boolean>(false);
  public readonly touched: WritableSignal<boolean> = signal<boolean>(false);
  public readonly value: WritableSignal<ListboxModelValue> = signal<ListboxModelValue>(['shoyu']);
  public readonly options: readonly ListboxOption[] = options;
  public readonly offsets: number[] = [];
  public touches: number = 0;
}

describe('Listbox value and templates', (): void => {
  it('renders grouped options and exposes item state', (): void => {
    const fixture: ComponentFixture<ListboxHost> = render(ListboxHost);

    expect(queryAll(fixture, '[role="option"]')).toHaveLength(4);
    expect(queryAll(fixture, '[role="presentation"]')).toHaveLength(2);
    expect(query(fixture, '[data-item="shoyu"]').getAttribute('data-selected')).toBe('true');
    expect(query(fixture, '[data-item="sold-out"]').getAttribute('data-disabled')).toBe('true');
  });

  it('filters through the custom filter context', (): void => {
    const fixture: ComponentFixture<ListboxHost> = render(ListboxHost);
    const filter: HTMLInputElement = query(fixture, 'input');
    filter.value = 'yuz';
    filter.dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();

    expect(queryAll(fixture, '[role="option"]')).toHaveLength(1);
    expect(query(fixture, '[data-item="yuzu"]').textContent.trim()).toBe('Yuzu');
  });

  it('reflects external model updates', (): void => {
    const fixture: ComponentFixture<ListboxHost> = render(ListboxHost);
    fixture.componentInstance.value.set(['miso', 'yuzu']);
    fixture.detectChanges();

    expect(query(fixture, '[data-item="miso"]').getAttribute('data-selected')).toBe('true');
    expect(query(fixture, '[data-item="yuzu"]').getAttribute('data-selected')).toBe('true');
  });
});

describe('Listbox selection', (): void => {
  it('selects enabled options and clears visible selections', (): void => {
    const fixture: ComponentFixture<ListboxHost> = render(ListboxHost);
    const yuzu: HTMLElement | null = query(fixture, '[data-item="yuzu"]').closest<HTMLElement>('[role="option"]');
    if (yuzu === null) throw new Error('Expected Yuzu to be rendered inside an option.');
    yuzu.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.value()).toEqual(['shoyu', 'yuzu']);

    const selectAll: HTMLButtonElement = query(fixture, 'button');
    selectAll.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.value()).toEqual(['miso', 'shoyu', 'yuzu']);

    selectAll.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.value()).toEqual([]);
  });

  it('keeps disabled and readonly listboxes focusable without changes', (): void => {
    const fixture: ComponentFixture<ListboxHost> = render(ListboxHost);
    const listbox: HTMLElement = query(fixture, '[role="listbox"]') as HTMLElement;
    fixture.componentInstance.disabled.set(true);
    fixture.detectChanges();

    fixture.componentInstance.control().focus();
    const yuzu: HTMLElement = query(fixture, '[data-item="yuzu"]') as HTMLElement;
    yuzu.click();
    fixture.detectChanges();
    expect(document.activeElement).toBe(listbox);
    expect(fixture.componentInstance.value()).toEqual(['shoyu']);

    fixture.componentInstance.disabled.set(false);
    fixture.componentInstance.readOnly.set(true);
    fixture.detectChanges();
    const miso: HTMLElement = query(fixture, '[data-item="miso"]') as HTMLElement;
    miso.click();
    expect(fixture.componentInstance.value()).toEqual(['shoyu']);
  });
});

describe('Listbox validation state', (): void => {
  it('exposes required and delayed invalid state', (): void => {
    const fixture: ComponentFixture<ListboxHost> = render(ListboxHost);
    const listbox: Element = query(fixture, '[role="listbox"]');
    fixture.componentInstance.invalid.set(true);
    fixture.detectChanges();

    expect(listbox.getAttribute('aria-required')).toBe('true');
    expect(listbox.hasAttribute('aria-invalid')).toBe(false);

    fixture.componentInstance.touched.set(true);
    fixture.detectChanges();
    expect(listbox.getAttribute('aria-invalid')).toBe('true');
  });
});

describe('Listbox lazy loading', (): void => {
  it('requests each loaded offset once at the scroll boundary', (): void => {
    const fixture: ComponentFixture<ListboxHost> = render(ListboxHost);
    const listbox: HTMLElement = query(fixture, '[role="listbox"]') as HTMLElement;
    Object.defineProperties(listbox, {
      clientHeight: { configurable: true, value: 100 },
      scrollHeight: { configurable: true, value: 200 },
      scrollTop: { configurable: true, value: 100 },
    });

    listbox.dispatchEvent(new Event('scroll'));
    listbox.dispatchEvent(new Event('scroll'));
    expect(fixture.componentInstance.offsets).toEqual([4]);

    fixture.componentInstance.loading.set(true);
    fixture.detectChanges();
    listbox.dispatchEvent(new Event('scroll'));
    expect(fixture.componentInstance.offsets).toEqual([4]);
  });

  it('emits touch only after focus leaves the whole control', (): void => {
    const fixture: ComponentFixture<ListboxHost> = render(ListboxHost);
    const listbox: HTMLElement = query(fixture, '[role="listbox"]') as HTMLElement;
    const filter: HTMLInputElement = query(fixture, 'input');
    listbox.dispatchEvent(new FocusEvent('focusout', { bubbles: true, relatedTarget: filter }));
    expect(fixture.componentInstance.touches).toBe(0);

    press(listbox, 'Tab');
    listbox.dispatchEvent(new FocusEvent('focusout', { bubbles: true }));
    expect(fixture.componentInstance.touches).toBe(1);
  });
});
