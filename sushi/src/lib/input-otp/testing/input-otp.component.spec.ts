import { Component, signal, Signal, viewChild, WritableSignal } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { query, queryAll, render } from '../../../../testing/test-utils';
import { InputOtp } from '../input-otp.component';

@Component({
  imports: [InputOtp],
  template: `
    <sui-input-otp
      ariaLabel="Verification code"
      [disabled]="disabled()"
      [invalid]="invalid()"
      [joined]="joined()"
      [length]="4"
      [masked]="masked()"
      [numeric]="numeric()"
      [(value)]="value"
      (touch)="touches += 1"
    />
  `,
})
class InputOtpHost {
  public readonly control: Signal<InputOtp> = viewChild.required(InputOtp);
  public readonly disabled: WritableSignal<boolean> = signal<boolean>(false);
  public readonly invalid: WritableSignal<boolean> = signal<boolean>(false);
  public readonly joined: WritableSignal<boolean> = signal<boolean>(false);
  public readonly masked: WritableSignal<boolean> = signal<boolean>(false);
  public readonly numeric: WritableSignal<boolean> = signal<boolean>(true);
  public readonly value: WritableSignal<string> = signal<string>('12');
  public touches: number = 0;
}

describe('InputOtp semantics', (): void => {
  it('renders visual slots around one accessible native input', (): void => {
    const fixture: ComponentFixture<InputOtpHost> = render(InputOtpHost);
    const input: HTMLInputElement = query(fixture, 'input');

    expect(queryAll(fixture, 'span')).toHaveLength(4);
    expect(input.value).toBe('12');
    expect(input.maxLength).toBe(4);
    expect(input.autocomplete).toBe('one-time-code');
    expect(input.inputMode).toBe('numeric');
    expect(input.pattern).toBe('[0-9]{4}');
    expect(input.getAttribute('aria-label')).toBe('Verification code');
  });

  it('switches masking, character mode, grouping, and invalid state', (): void => {
    const fixture: ComponentFixture<InputOtpHost> = render(InputOtpHost);
    const input: HTMLInputElement = query(fixture, 'input');
    const label: HTMLLabelElement = query(fixture, 'label');
    fixture.componentInstance.masked.set(true);
    fixture.componentInstance.numeric.set(false);
    fixture.componentInstance.joined.set(true);
    fixture.componentInstance.invalid.set(true);
    fixture.detectChanges();

    expect(input.type).toBe('password');
    expect(input.inputMode).toBe('text');
    expect(input.pattern).toBe('.{4}');
    expect(input.getAttribute('aria-invalid')).toBe('true');
    expect(label.classList.contains('otp-joined')).toBe(true);
  });
});

describe('InputOtp value and interaction', (): void => {
  it('normalizes numeric input and limits its length', (): void => {
    const fixture: ComponentFixture<InputOtpHost> = render(InputOtpHost);
    const input: HTMLInputElement = query(fixture, 'input');
    input.value = '1a23-45';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();

    expect(input.value).toBe('1234');
    expect(fixture.componentInstance.value()).toBe('1234');
  });

  it('allows arbitrary characters when numeric mode is off', (): void => {
    const fixture: ComponentFixture<InputOtpHost> = render(InputOtpHost);
    const input: HTMLInputElement = query(fixture, 'input');
    fixture.componentInstance.numeric.set(false);
    fixture.detectChanges();
    input.value = 'A-7!x';
    input.dispatchEvent(new Event('input', { bubbles: true }));

    expect(fixture.componentInstance.value()).toBe('A-7!');
  });

  it('focuses and resets through its public control methods', (): void => {
    const fixture: ComponentFixture<InputOtpHost> = render(InputOtpHost);
    const input: HTMLInputElement = query(fixture, 'input');
    fixture.componentInstance.control().focus();
    expect(document.activeElement).toBe(input);

    fixture.componentInstance.control().reset();
    fixture.detectChanges();
    expect(fixture.componentInstance.value()).toBe('');
    expect(input.value).toBe('');
  });

  it('emits touch when the input loses focus', (): void => {
    const fixture: ComponentFixture<InputOtpHost> = render(InputOtpHost);
    query(fixture, 'input').dispatchEvent(new FocusEvent('blur'));
    expect(fixture.componentInstance.touches).toBe(1);
  });
});

describe('InputOtp disabled state', (): void => {
  it('remains focusable while blocking value changes', (): void => {
    const fixture: ComponentFixture<InputOtpHost> = render(InputOtpHost);
    const input: HTMLInputElement = query(fixture, 'input');
    fixture.componentInstance.disabled.set(true);
    fixture.detectChanges();

    fixture.componentInstance.control().focus();
    input.value = '9999';
    input.dispatchEvent(new Event('input', { bubbles: true }));

    expect(document.activeElement).toBe(input);
    expect(input.readOnly).toBe(true);
    expect(input.getAttribute('aria-disabled')).toBe('true');
    expect(fixture.componentInstance.value()).toBe('12');
  });
});
