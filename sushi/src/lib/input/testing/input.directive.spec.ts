import { Component, signal, WritableSignal } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { query, render } from '../../../../testing/test-utils';
import { Input } from '../input.directive';

@Component({
  imports: [Input],
  template: `
    <input
      suiInput
      type="email"
      placeholder="name@example.com"
      [dirty]="dirty()"
      [fluid]="fluid()"
      [invalid]="invalid()"
      [severity]="severity()"
      [showClear]="showClear()"
      [size]="size()"
    />
  `,
})
class InputHost {
  public readonly dirty: WritableSignal<boolean> = signal<boolean>(false);
  public readonly fluid: WritableSignal<boolean> = signal<boolean>(false);
  public readonly invalid: WritableSignal<boolean> = signal<boolean>(false);
  public readonly severity: WritableSignal<'success' | null> = signal<'success' | null>(null);
  public readonly showClear: WritableSignal<boolean> = signal<boolean>(true);
  public readonly size: WritableSignal<'md' | 'lg'> = signal<'md' | 'lg'>('md');
}

describe('Input', (): void => {
  it('preserves native input attributes and editing', (): void => {
    const input: HTMLInputElement = query(render(InputHost), 'input');

    expect(input.type).toBe('email');
    expect(input.placeholder).toBe('name@example.com');
    input.value = 'nori@example.com';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    expect(input.value).toBe('nori@example.com');
  });

  it('maps its supported layout and appearance inputs', (): void => {
    const fixture: ComponentFixture<InputHost> = render(InputHost);
    const input: HTMLInputElement = query(fixture, 'input');
    fixture.componentInstance.fluid.set(true);
    fixture.componentInstance.severity.set('success');
    fixture.componentInstance.showClear.set(false);
    fixture.componentInstance.size.set('lg');
    fixture.detectChanges();

    expect(input.classList).toContain('w-full');
    expect(input.classList).toContain('input-success');
    expect(input.classList).toContain('input-lg');
    expect(input.classList).toContain('sui-input--clear-hidden');
  });

  it('exposes invalid state only after the value changes', (): void => {
    const fixture: ComponentFixture<InputHost> = render(InputHost);
    const input: HTMLInputElement = query(fixture, 'input');
    fixture.componentInstance.invalid.set(true);
    fixture.detectChanges();
    expect(input.hasAttribute('aria-invalid')).toBe(false);

    fixture.componentInstance.dirty.set(true);
    fixture.detectChanges();
    expect(input.getAttribute('aria-invalid')).toBe('true');
    expect(input.classList).toContain('input-error');
  });
});
