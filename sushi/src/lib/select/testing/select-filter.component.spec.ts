import { Component, signal, type WritableSignal } from '@angular/core';
import { type ComponentFixture } from '@angular/core/testing';
import { afterEach, describe, expect, it } from 'vitest';
import { query, render } from '../../../../testing/test-utils';
import { Select } from '../select.component';
import { type SelectModelValue, type SelectOption } from '../select.interfaces';

@Component({
  imports: [Select],
  template: `<sui-select filter filterLabel="Filter ramen" [options]="options" [(value)]="value" />`,
})
class FilterHost {
  public readonly options: readonly SelectOption[] = [
    { label: 'Miso', value: 'miso' },
    { label: 'Shoyu', value: 'shoyu' },
    { label: 'Sold out', value: 'sold-out', disabled: true },
  ];
  public readonly value: WritableSignal<SelectModelValue> = signal('shoyu');
}

afterEach((): void => document.querySelectorAll('.cdk-overlay-container').forEach((element: Element): void => element.remove()));

async function openFilter(fixture: ComponentFixture<FilterHost>): Promise<HTMLInputElement> {
  query(fixture, '[role="combobox"]').dispatchEvent(new MouseEvent('click', { bubbles: true }));
  await fixture.whenStable();

  const input: HTMLInputElement | null = document.querySelector('[aria-label="Filter ramen"]');
  if (!input) throw new Error('Expected the public Select filter input.');
  return input;
}

describe('Select filtering', (): void => {
  it('filters labels without changing selection and resets the query on reopening', async (): Promise<void> => {
    const fixture: ComponentFixture<FilterHost> = render(FilterHost);
    const input: HTMLInputElement = await openFilter(fixture);

    input.value = 'MIS';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await fixture.whenStable();

    expect(document.querySelectorAll('[role="option"]')).toHaveLength(1);
    expect(document.querySelector('[role="option"]')?.textContent).toContain('Miso');
    expect(fixture.componentInstance.value()).toBe('shoyu');

    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    await fixture.whenStable();

    const reopened: HTMLInputElement = await openFilter(fixture);

    expect(reopened.value).toBe('');
    expect(document.querySelectorAll('[role="option"]')).toHaveLength(3);
  });

  it('shows a distinct no-match message and retains the selected value', async (): Promise<void> => {
    const fixture: ComponentFixture<FilterHost> = render(FilterHost);
    const input: HTMLInputElement = await openFilter(fixture);

    input.value = 'not available';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await fixture.whenStable();

    expect(document.body.textContent).toContain('No matching options');
    expect(fixture.componentInstance.value()).toBe('shoyu');
  });
});
