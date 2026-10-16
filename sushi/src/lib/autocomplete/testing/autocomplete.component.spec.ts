import { Component, signal, Signal, viewChild, WritableSignal } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { press, query, render } from '../../../../testing/test-utils';
import { Autocomplete } from '../autocomplete.component';
import type { AutocompleteOption, AutocompleteValue } from '../autocomplete.interfaces';
import { AutocompleteEmptyTemplate, AutocompleteItemTemplate, AutocompletePrefixTemplate } from '../autocomplete.templates';

interface RamenOption extends AutocompleteOption {
  readonly origin: string;
}

const options: readonly RamenOption[] = [
  { label: 'Miso', value: 'miso', origin: 'Sapporo' },
  { label: 'Shoyu', value: 'shoyu', origin: 'Tokyo' },
  { label: 'Unavailable', value: 'disabled', disabled: true, origin: 'Kyoto' },
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
      <ng-template [suiAutocompleteItem]="options" let-option let-index="index">
        <span [attr.data-index]="index">{{ option.label }} · {{ option.origin }}</span>
      </ng-template>
      <ng-template suiAutocompleteEmpty let-query="query"
        ><span data-empty>No match for {{ query }}</span></ng-template
      >
    </sui-autocomplete>
  `,
})
class AutocompleteHost {
  public readonly control: Signal<Autocomplete<RamenOption>> = viewChild.required<Autocomplete<RamenOption>>(Autocomplete);
  public readonly delay: WritableSignal<number> = signal<number>(0);
  public readonly disabled: WritableSignal<boolean> = signal<boolean>(false);
  public readonly errorMessage: WritableSignal<string | null> = signal<string | null>(null);
  public readonly forceSelection: WritableSignal<boolean> = signal<boolean>(false);
  public readonly loading: WritableSignal<boolean> = signal<boolean>(false);
  public readonly options: readonly RamenOption[] = options;
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

afterEach((): void => {
  vi.useRealTimers();
  document.querySelector('.cdk-overlay-container')?.remove();
});

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
    expect(document.querySelector('[role="listbox"]')).toBeNull();
    expect(fixture.componentInstance.touches).toBe(1);
  });
});

describe('Autocomplete constraints', (): void => {
  it('emits touch when a closed input loses focus', (): void => {
    const fixture: ComponentFixture<AutocompleteHost> = render(AutocompleteHost);
    query(fixture, 'input').dispatchEvent(new FocusEvent('blur'));

    expect(fixture.componentInstance.touches).toBe(1);
  });

  it('restores the previous selection when force selection editing is cancelled', (): void => {
    const fixture: ComponentFixture<AutocompleteHost> = render(AutocompleteHost);
    fixture.componentInstance.forceSelection.set(true);
    fixture.detectChanges();
    const input: HTMLInputElement = enter(fixture, 'Unknown');
    press(input, 'Escape');
    fixture.detectChanges();

    expect(fixture.componentInstance.value()).toBe('shoyu');
    expect(input.value).toBe('Shoyu');
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
  it('cancels a pending query when disabled', (): void => {
    vi.useFakeTimers();
    const fixture: ComponentFixture<AutocompleteHost> = render(AutocompleteHost);
    fixture.componentInstance.delay.set(10);
    fixture.detectChanges();

    enter(fixture, 'Miso');
    fixture.componentInstance.disabled.set(true);
    fixture.detectChanges();
    vi.advanceTimersByTime(10);

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

describe('Autocomplete public popup methods', (): void => {
  it('shows all suggestions without clearing selection and can close explicitly', async (): Promise<void> => {
    const fixture: ComponentFixture<AutocompleteHost> = render(AutocompleteHost);
    fixture.componentInstance.control().show();
    await fixture.whenStable();

    expect(document.querySelectorAll('[role="option"]')).toHaveLength(3);
    expect(query(fixture, 'input').value).toBe('Shoyu');
    expect(fixture.componentInstance.queries).toEqual(['']);
    expect(fixture.componentInstance.value()).toBe('shoyu');

    fixture.componentInstance.control().hide();
    await fixture.whenStable();

    expect(document.querySelector('[role="listbox"]')).toBeNull();
  });

  it('does not open or request options when disabled or loading', (): void => {
    const fixture: ComponentFixture<AutocompleteHost> = render(AutocompleteHost);
    fixture.componentInstance.disabled.set(true);
    fixture.detectChanges();
    fixture.componentInstance.control().show();
    fixture.componentInstance.disabled.set(false);
    fixture.componentInstance.loading.set(true);
    fixture.detectChanges();
    fixture.componentInstance.control().show();

    expect(fixture.componentInstance.queries).toEqual([]);
    expect(document.querySelector('[role="listbox"]')).toBeNull();
  });
});

describe('Autocomplete cancelled edits', (): void => {
  it('cancels a delayed query without reopening after Escape', (): void => {
    vi.useFakeTimers();
    const fixture: ComponentFixture<AutocompleteHost> = render(AutocompleteHost);
    fixture.componentInstance.delay.set(300);
    fixture.detectChanges();
    const input: HTMLInputElement = enter(fixture, 'Miso');
    press(input, 'Escape');
    fixture.detectChanges();
    vi.advanceTimersByTime(300);

    expect(fixture.componentInstance.value()).toBe('shoyu');
    expect(input.value).toBe('Shoyu');
    expect(fixture.componentInstance.queries).toEqual([]);
    expect(document.querySelector('[role="listbox"]')).toBeNull();
  });
});

describe('Autocomplete keyboard opening', (): void => {
  it('opens every option and requests an empty query without filtering by the selected label', async (): Promise<void> => {
    const fixture: ComponentFixture<AutocompleteHost> = render(AutocompleteHost);
    const input: HTMLInputElement = query(fixture, 'input');
    input.focus();
    press(input, 'ArrowDown');
    await fixture.whenStable();

    expect(input.value).toBe('Shoyu');
    expect(document.querySelectorAll('[role="option"]')).toHaveLength(3);
    expect(fixture.componentInstance.queries).toEqual(['']);
    expect(fixture.componentInstance.value()).toBe('shoyu');
  });
});

describe('Autocomplete text composition', (): void => {
  it('keeps the edit and suggestions when Escape belongs to text composition', async (): Promise<void> => {
    const fixture: ComponentFixture<AutocompleteHost> = render(AutocompleteHost);
    fixture.componentInstance.forceSelection.set(true);
    fixture.detectChanges();
    const input: HTMLInputElement = enter(fixture, 'Mis');
    await fixture.whenStable();

    const cancel: KeyboardEvent = new KeyboardEvent('keydown', {
      key: 'Escape',
      isComposing: true,
      bubbles: true,
      cancelable: true,
    });
    input.dispatchEvent(cancel);
    await fixture.whenStable();

    expect(cancel.defaultPrevented).toBe(false);
    expect(input.value).toBe('Mis');
    expect(fixture.componentInstance.value()).toBe('shoyu');
    expect(document.querySelector('[role="listbox"]')).not.toBeNull();
  });
});
