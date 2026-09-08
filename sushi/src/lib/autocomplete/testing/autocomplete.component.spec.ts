import { Component, signal, Signal, viewChild, WritableSignal } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';
import { afterEach, describe, expect, it } from 'vitest';
import { press, query, render } from '../../../../testing/test-utils';
import { Autocomplete } from '../autocomplete.component';
import type { AutocompleteOption, AutocompleteValue } from '../autocomplete.interfaces';
import { AutocompleteEmptyTemplate, AutocompleteItemTemplate, AutocompletePrefixTemplate } from '../autocomplete.templates';

const options: readonly AutocompleteOption[] = [
  { label: 'Miso', value: 'miso' },
  { label: 'Shoyu', value: 'shoyu' },
  { label: 'Unavailable', value: 'disabled', disabled: true },
];

@Component({
  imports: [Autocomplete, AutocompleteEmptyTemplate, AutocompleteItemTemplate, AutocompletePrefixTemplate],
  template: `
    <sui-autocomplete
      ariaLabel="Ramen style"
      placeholder="Search ramen"
      [delay]="delay()"
      [disabled]="disabled()"
      [errorMessage]="errorMessage()"
      [forceSelection]="forceSelection()"
      [loading]="loading()"
      [minQueryLength]="2"
      [options]="options"
      [required]="required()"
      [(value)]="value"
      (queryChange)="queries.push($event)"
      (touch)="touches += 1"
    >
      <ng-template suiAutocompletePrefix><span data-prefix>⌕</span></ng-template>
      <ng-template suiAutocompleteItem let-option let-index="index">
        <span [attr.data-index]="index">{{ option.label }}</span>
      </ng-template>
      <ng-template suiAutocompleteEmpty let-query="query"
        ><span data-empty>No match for {{ query }}</span></ng-template
      >
    </sui-autocomplete>
  `,
})
class AutocompleteHost {
  public readonly control: Signal<Autocomplete> = viewChild.required(Autocomplete);
  public readonly delay: WritableSignal<number> = signal<number>(0);
  public readonly disabled: WritableSignal<boolean> = signal<boolean>(false);
  public readonly errorMessage: WritableSignal<string | null> = signal<string | null>(null);
  public readonly forceSelection: WritableSignal<boolean> = signal<boolean>(false);
  public readonly loading: WritableSignal<boolean> = signal<boolean>(false);
  public readonly options: readonly AutocompleteOption[] = options;
  public readonly required: WritableSignal<boolean> = signal<boolean>(false);
  public readonly value: WritableSignal<AutocompleteValue> = signal<AutocompleteValue>('shoyu');
  public readonly queries: string[] = [];
  public touches: number = 0;
}

function enter(fixture: ComponentFixture<AutocompleteHost>, value: string): HTMLInputElement {
  const input: HTMLInputElement = query(fixture, 'input');
  input.value = value;
  input.dispatchEvent(new Event('input', { bubbles: true }));
  fixture.detectChanges();
  return input;
}

afterEach((): void => document.querySelector('.cdk-overlay-container')?.remove());

describe('Autocomplete value and query', (): void => {
  it('renders selected labels and supports focus and reset', (): void => {
    const fixture: ComponentFixture<AutocompleteHost> = render(AutocompleteHost);
    const input: HTMLInputElement = query(fixture, 'input');

    expect(input.value).toBe('Shoyu');
    fixture.componentInstance.control().focus();
    expect(document.activeElement).toBe(input);

    fixture.componentInstance.control().reset();
    fixture.detectChanges();
    expect(fixture.componentInstance.value()).toBeNull();
    expect(input.value).toBe('');
  });

  it('updates free text immediately but waits for the minimum query length', async (): Promise<void> => {
    const fixture: ComponentFixture<AutocompleteHost> = render(AutocompleteHost);

    enter(fixture, 'M');
    expect(fixture.componentInstance.value()).toBe('M');
    expect(fixture.componentInstance.queries).toEqual([]);

    enter(fixture, 'Mi');
    await fixture.whenStable();
    expect(fixture.componentInstance.queries).toEqual(['Mi']);
    expect(document.querySelectorAll('[role="option"]')).toHaveLength(1);
  });

  it('selects a suggestion and closes the interaction', async (): Promise<void> => {
    const fixture: ComponentFixture<AutocompleteHost> = render(AutocompleteHost);
    const input: HTMLInputElement = enter(fixture, 'Mis');
    await fixture.whenStable();

    const option: HTMLElement | null = document.querySelector<HTMLElement>('[role="option"]');
    if (option === null) throw new Error('Expected one matching suggestion.');
    option.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.value()).toBe('miso');
    expect(input.value).toBe('Miso');
    expect(fixture.componentInstance.touches).toBe(1);
  });
});

describe('Autocomplete constraints', (): void => {
  it('emits touch when a closed input loses focus', (): void => {
    const fixture: ComponentFixture<AutocompleteHost> = render(AutocompleteHost);
    query(fixture, 'input').dispatchEvent(new FocusEvent('blur'));
    expect(fixture.componentInstance.touches).toBe(1);
  });

  it('restores an empty valid value when force selection closes', (): void => {
    const fixture: ComponentFixture<AutocompleteHost> = render(AutocompleteHost);
    fixture.componentInstance.forceSelection.set(true);
    fixture.detectChanges();
    const input: HTMLInputElement = enter(fixture, 'Unknown');
    press(input, 'Escape');
    fixture.detectChanges();

    expect(fixture.componentInstance.value()).toBeNull();
    expect(input.value).toBe('');
    expect(fixture.componentInstance.touches).toBe(1);
  });

  it('hard-disables the input without querying or opening', (): void => {
    const fixture: ComponentFixture<AutocompleteHost> = render(AutocompleteHost);
    fixture.componentInstance.disabled.set(true);
    fixture.detectChanges();
    const input: HTMLInputElement = enter(fixture, 'Miso');
    fixture.componentInstance.control().focus();

    expect(input.disabled).toBe(true);
    expect(input.tabIndex).toBe(-1);
    expect(input.classList.contains('select-none')).toBe(true);
    expect(fixture.componentInstance.value()).toBe('shoyu');
    expect(fixture.componentInstance.queries).toEqual([]);
    expect(document.querySelector('[role="listbox"]')).toBeNull();
  });
});

describe('Autocomplete pending queries', (): void => {
  it('cancels a pending query when disabled', async (): Promise<void> => {
    const fixture: ComponentFixture<AutocompleteHost> = render(AutocompleteHost);
    fixture.componentInstance.delay.set(10);
    fixture.detectChanges();

    enter(fixture, 'Miso');
    fixture.componentInstance.disabled.set(true);
    fixture.detectChanges();
    await new Promise<void>((resolve: () => void): void => {
      setTimeout(resolve, 20);
    });

    expect(fixture.componentInstance.queries).toEqual([]);
    expect(document.querySelector('[role="listbox"]')).toBeNull();
  });
});

describe('Autocomplete templates', (): void => {
  it('renders custom prefix and empty-result context', async (): Promise<void> => {
    const fixture: ComponentFixture<AutocompleteHost> = render(AutocompleteHost);
    expect(query(fixture, '[data-prefix]').textContent).toBe('⌕');

    enter(fixture, 'none');
    await fixture.whenStable();
    expect(document.querySelector('[data-empty]')?.textContent).toContain('none');
  });
});
