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
      [delay]="0"
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

  it('keeps disabled inputs focusable without querying or opening', (): void => {
    const fixture: ComponentFixture<AutocompleteHost> = render(AutocompleteHost);
    fixture.componentInstance.disabled.set(true);
    fixture.detectChanges();
    const input: HTMLInputElement = enter(fixture, 'Miso');
    input.focus();

    expect(input.disabled).toBe(false);
    expect(input.getAttribute('aria-disabled')).toBe('true');
    expect(document.activeElement).toBe(input);
    expect(fixture.componentInstance.queries).toEqual([]);
    expect(document.querySelector('[role="listbox"]')).toBeNull();
  });

  it('renders custom prefix and empty-result context', async (): Promise<void> => {
    const fixture: ComponentFixture<AutocompleteHost> = render(AutocompleteHost);
    expect(query(fixture, '[data-prefix]').textContent).toBe('⌕');

    enter(fixture, 'none');
    await fixture.whenStable();
    expect(document.querySelector('[data-empty]')?.textContent).toContain('none');
  });
});
