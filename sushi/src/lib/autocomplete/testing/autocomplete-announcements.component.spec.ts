import { Component, signal, type Signal, viewChild, type WritableSignal } from '@angular/core';
import { type ComponentFixture } from '@angular/core/testing';
import { afterEach, describe, expect, it } from 'vitest';
import { query, render } from '../../../../testing/test-utils';
import { Autocomplete } from '../autocomplete.component';
import { type AutocompleteOption } from '../autocomplete.interfaces';

@Component({
  imports: [Autocomplete],
  template: `
    <sui-autocomplete
      ariaLabel="Ramen style"
      [options]="options"
      [delay]="0"
      [loading]="loading()"
      [errorMessage]="errorMessage()"
      [suggestionsMessage]="suggestionsMessage()"
    />
  `,
})
class AnnouncementHost {
  public readonly control: Signal<Autocomplete> = viewChild.required(Autocomplete);
  public readonly options: readonly AutocompleteOption[] = [
    { label: 'Miso', value: 'miso' },
    { label: 'Shoyu', value: 'shoyu' },
  ];
  public readonly loading: WritableSignal<boolean> = signal(false);
  public readonly errorMessage: WritableSignal<string | null> = signal(null);
  public readonly suggestionsMessage: WritableSignal<(count: number) => string> = signal(
    (count: number): string => `${count} ${count === 1 ? 'Vorschlag' : 'Vorschläge'} verfügbar.`,
  );
}

afterEach((): void => {
  document.querySelector('.cdk-overlay-container')?.remove();
});

describe('Autocomplete translated announcements', (): void => {
  it('updates translated singular/plural counts and accepts a replacement formatter while open', async (): Promise<void> => {
    const fixture: ComponentFixture<AnnouncementHost> = render(AnnouncementHost);
    fixture.componentInstance.control().show();
    await fixture.whenStable();

    expect(query(fixture, '[role="status"]').textContent.trim()).toBe('2 Vorschläge verfügbar.');

    const input: HTMLInputElement = query(fixture, 'input');
    input.value = 'Mis';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await fixture.whenStable();

    expect(query(fixture, '[role="status"]').textContent.trim()).toBe('1 Vorschlag verfügbar.');

    fixture.componentInstance.suggestionsMessage.set(
      (count: number): string => `${count} ${count === 1 ? 'suggerimento disponibile' : 'suggerimenti disponibili'}.`,
    );
    await fixture.whenStable();

    expect(query(fixture, '[role="status"]').textContent.trim()).toBe('1 suggerimento disponibile.');

    input.value = 'o';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await fixture.whenStable();

    expect(query(fixture, '[role="status"]').textContent.trim()).toBe('2 suggerimenti disponibili.');
  });
});

describe('Autocomplete announcement visibility', (): void => {
  it('omits the count while closed, loading, failed or empty', async (): Promise<void> => {
    const fixture: ComponentFixture<AnnouncementHost> = render(AnnouncementHost);
    expect(query(fixture, 'sui-autocomplete').querySelector('[role="status"]')).toBeNull();

    fixture.componentInstance.control().show();
    await fixture.whenStable();
    expect(query(fixture, '[role="status"]').textContent.trim()).toBe('2 Vorschläge verfügbar.');

    fixture.componentInstance.loading.set(true);
    await fixture.whenStable();
    expect(query(fixture, 'sui-autocomplete').querySelector('[role="status"]')).toBeNull();

    fixture.componentInstance.loading.set(false);
    fixture.componentInstance.errorMessage.set('Laden fehlgeschlagen');
    await fixture.whenStable();
    expect(query(fixture, 'sui-autocomplete').querySelector('[role="status"]')).toBeNull();

    fixture.componentInstance.errorMessage.set(null);
    const input: HTMLInputElement = query(fixture, 'input');
    input.value = 'Unknown';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await fixture.whenStable();
    expect(query(fixture, 'sui-autocomplete').querySelector('[role="status"]')).toBeNull();
  });
});
