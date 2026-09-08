import { Component, signal, Signal, viewChild, WritableSignal } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { press, query, queryAll, render } from '../../../../testing/test-utils';
import { InputNumber } from '../input-number.component';
import { InputNumberButtonsTemplate } from '../input-number.templates';

@Component({
  imports: [InputNumber],
  template: `
    <sui-input-number
      ariaLabel="Budget"
      ariaDescribedby="budget-hint"
      currency="EUR"
      locale="de-DE"
      prefix="~"
      suffix="net"
      showButtons
      [disabled]="disabled()"
      [invalid]="invalid()"
      [max]="12"
      [min]="2"
      [step]="2"
      [(value)]="value"
      (touch)="touches += 1"
    />
  `,
})
class InputNumberHost {
  public readonly control: Signal<InputNumber> = viewChild.required(InputNumber);
  public readonly disabled: WritableSignal<boolean> = signal<boolean>(false);
  public readonly invalid: WritableSignal<boolean> = signal<boolean>(false);
  public readonly value: WritableSignal<number | null> = signal<number | null>(8);
  public touches: number = 0;
}

@Component({
  imports: [InputNumber, InputNumberButtonsTemplate],
  template: `
    <sui-input-number [(value)]="value">
      <ng-template suiInputNumberButtons let-value let-disabled="disabled" let-decrement="decrement" let-increment="increment">
        <button data-decrement type="button" [disabled]="disabled" (click)="decrement()">Less</button>
        <output data-value>{{ value }}</output>
        <button data-increment type="button" [disabled]="disabled" (click)="increment()">More</button>
      </ng-template>
    </sui-input-number>
  `,
})
class CustomInputNumberHost {
  public readonly value: WritableSignal<number | null> = signal<number | null>(3);
}

describe('InputNumber value and formatting', (): void => {
  it('formats its resting value and exposes spinbutton semantics', (): void => {
    const fixture: ComponentFixture<InputNumberHost> = render(InputNumberHost);
    const input: HTMLInputElement = query(fixture, 'input');
    const root: HTMLElement = fixture.nativeElement as HTMLElement;
    const expected: string = new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 3,
    }).format(8);

    expect(input.value).toBe(expected);
    expect(input.getAttribute('role')).toBe('spinbutton');
    expect(input.getAttribute('aria-label')).toBe('Budget');
    expect(input.getAttribute('aria-describedby')).toBe('budget-hint');
    expect(input.getAttribute('aria-valuemin')).toBe('2');
    expect(input.getAttribute('aria-valuemax')).toBe('12');
    expect(root.textContent).toContain('~');
    expect(root.textContent).toContain('net');
  });

  it('parses localized input and clamps it to the configured range', (): void => {
    const fixture: ComponentFixture<InputNumberHost> = render(InputNumberHost);
    const input: HTMLInputElement = query(fixture, 'input');
    input.dispatchEvent(new FocusEvent('focus'));
    fixture.detectChanges();
    expect(input.value).toBe('8');

    input.value = '99,5 €';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();
    expect(fixture.componentInstance.value()).toBe(12);

    input.value = '';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    expect(fixture.componentInstance.value()).toBeNull();
  });
});

describe('InputNumber reset', (): void => {
  it('returns to formatted display without changing the value', (): void => {
    const fixture: ComponentFixture<InputNumberHost> = render(InputNumberHost);
    const input: HTMLInputElement = query(fixture, 'input');
    input.dispatchEvent(new FocusEvent('focus'));
    fixture.componentInstance.control().reset();
    fixture.detectChanges();

    expect(fixture.componentInstance.value()).toBe(8);
    expect(input.value).toContain('€');
  });
});

describe('InputNumber interaction', (): void => {
  it('steps with buttons and arrow keys while respecting bounds', (): void => {
    const fixture: ComponentFixture<InputNumberHost> = render(InputNumberHost);
    const input: HTMLInputElement = query(fixture, 'input');
    const buttons: readonly HTMLButtonElement[] = queryAll(fixture, 'button');
    buttons[0].click();
    buttons[0].click();
    fixture.detectChanges();
    expect(fixture.componentInstance.value()).toBe(12);

    press(input, 'ArrowDown');
    fixture.detectChanges();
    expect(fixture.componentInstance.value()).toBe(10);

    buttons[1].click();
    expect(fixture.componentInstance.value()).toBe(8);
    expect(fixture.componentInstance.touches).toBe(3);
  });

  it('emits touch and restores formatting when focus leaves', (): void => {
    const fixture: ComponentFixture<InputNumberHost> = render(InputNumberHost);
    const input: HTMLInputElement = query(fixture, 'input');
    input.dispatchEvent(new FocusEvent('focus'));
    input.dispatchEvent(new FocusEvent('blur'));
    fixture.detectChanges();

    expect(fixture.componentInstance.touches).toBe(1);
    expect(input.value).toContain('€');
  });
});

describe('InputNumber disabled state', (): void => {
  it('hard-disables the native input and blocks every value change', (): void => {
    const fixture: ComponentFixture<InputNumberHost> = render(InputNumberHost);
    const input: HTMLInputElement = query(fixture, 'input');
    fixture.componentInstance.disabled.set(true);
    fixture.detectChanges();

    fixture.componentInstance.control().focus();
    input.value = '4';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    press(input, 'ArrowDown');
    query(fixture, 'button').dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(document.activeElement).not.toBe(input);
    expect(input.disabled).toBe(true);
    expect(input.getAttribute('aria-disabled')).toBe('true');
    expect(queryAll(fixture, 'button').every((button: HTMLButtonElement): boolean => button.tabIndex === -1)).toBe(true);
    expect(fixture.componentInstance.value()).toBe(8);
  });
});

describe('InputNumber custom controls', (): void => {
  it('exposes the value and step actions through its template context', (): void => {
    const fixture: ComponentFixture<CustomInputNumberHost> = render(CustomInputNumberHost);
    expect(query(fixture, '[data-value]').textContent).toBe('3');

    query(fixture, '[data-increment]').dispatchEvent(new MouseEvent('click', { bubbles: true }));
    fixture.detectChanges();
    expect(fixture.componentInstance.value()).toBe(4);

    query(fixture, '[data-decrement]').dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(fixture.componentInstance.value()).toBe(3);
  });
});
