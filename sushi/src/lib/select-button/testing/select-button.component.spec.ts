import { Component, signal, WritableSignal } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { press, query, queryAll, render } from '../../../../testing/test-utils';
import { SelectButton } from '../select-button.component';
import type { SelectButtonOption, SelectButtonOrientation, SelectButtonValue } from '../select-button.interfaces';
import { SelectButtonOptionTemplate } from '../select-button.templates';

const options: readonly SelectButtonOption[] = [
  { label: 'List', value: 'list' },
  { label: 'Board', value: 'board' },
  { label: 'Timeline', value: 'timeline', disabled: true },
];

@Component({
  imports: [SelectButton, SelectButtonOptionTemplate],
  template: `
    <sui-select-button
      ariaLabel="View"
      [allowEmpty]="allowEmpty()"
      [disabled]="disabled()"
      [options]="options"
      [orientation]="orientation()"
      [(value)]="value"
      (touch)="touches += 1"
    >
      <ng-template suiSelectButtonOption let-option let-index="index" let-selected="selected">
        <span [attr.data-option]="option.value" [attr.data-index]="index" [attr.data-selected]="selected">
          {{ option.label }}
        </span>
      </ng-template>
    </sui-select-button>
  `,
})
class SelectButtonHost {
  public readonly allowEmpty: WritableSignal<boolean> = signal<boolean>(false);
  public readonly disabled: WritableSignal<boolean> = signal<boolean>(false);
  public readonly orientation: WritableSignal<SelectButtonOrientation> = signal<SelectButtonOrientation>('horizontal');
  public readonly value: WritableSignal<SelectButtonValue | null> = signal<SelectButtonValue | null>('list');
  public readonly options: readonly SelectButtonOption[] = options;
  public touches: number = 0;
}

describe('SelectButton semantics', (): void => {
  it('renders one labelled radio group with a single tab stop', (): void => {
    const fixture: ComponentFixture<SelectButtonHost> = render(SelectButtonHost);
    const group: Element = query(fixture, '[role="radiogroup"]');
    const radios: readonly Element[] = queryAll(fixture, '[role="radio"]');

    expect(group.getAttribute('aria-label')).toBe('View');
    expect(group.getAttribute('aria-orientation')).toBe('horizontal');
    expect(radios.map((radio: Element): string | null => radio.getAttribute('tabindex'))).toEqual(['0', '-1', '-1']);
    expect(radios[0].getAttribute('aria-checked')).toBe('true');
    expect(radios[2].getAttribute('aria-disabled')).toBe('true');
  });

  it('exposes option state and index to a custom template', (): void => {
    const fixture: ComponentFixture<SelectButtonHost> = render(SelectButtonHost);
    expect(query(fixture, '[data-option="list"]').getAttribute('data-selected')).toBe('true');
    expect(query(fixture, '[data-option="board"]').getAttribute('data-index')).toBe('1');
  });
});

describe('SelectButton interaction', (): void => {
  it('selects an enabled option and optionally clears it', (): void => {
    const fixture: ComponentFixture<SelectButtonHost> = render(SelectButtonHost);
    const radios: readonly HTMLButtonElement[] = queryAll(fixture, 'button');
    radios[1].click();
    fixture.detectChanges();
    expect(fixture.componentInstance.value()).toBe('board');

    fixture.componentInstance.allowEmpty.set(true);
    fixture.detectChanges();
    radios[1].click();
    expect(fixture.componentInstance.value()).toBeNull();
    expect(fixture.componentInstance.touches).toBe(2);
  });

  it('moves and selects with orientation-aware arrow keys', (): void => {
    const fixture: ComponentFixture<SelectButtonHost> = render(SelectButtonHost);
    const radios: readonly HTMLButtonElement[] = queryAll(fixture, 'button');
    press(radios[0], 'ArrowRight');
    fixture.detectChanges();

    expect(document.activeElement).toBe(radios[1]);
    expect(fixture.componentInstance.value()).toBe('board');

    fixture.componentInstance.orientation.set('vertical');
    fixture.detectChanges();
    press(radios[1], 'ArrowUp');
    expect(document.activeElement).toBe(radios[0]);
    expect(fixture.componentInstance.value()).toBe('list');
  });

  it('keeps disabled options focusable without changing the value', (): void => {
    const fixture: ComponentFixture<SelectButtonHost> = render(SelectButtonHost);
    const radios: readonly HTMLButtonElement[] = queryAll(fixture, 'button');
    radios[2].focus();
    radios[2].click();

    expect(document.activeElement).toBe(radios[2]);
    expect(fixture.componentInstance.value()).toBe('list');
  });
});
