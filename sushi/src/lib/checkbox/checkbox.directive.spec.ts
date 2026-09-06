import { Component, signal, WritableSignal } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { query, render } from '../../../testing/test-utils';
import type { FormControlSeverity, FormControlSize } from '../form-control';
import { Checkbox } from './checkbox.directive';

@Component({
  imports: [Checkbox],
  template: `
    <input
      type="checkbox"
      suiCheckbox
      [dirty]="dirty()"
      [disabled]="disabled()"
      [indeterminate]="indeterminate()"
      [invalid]="invalid()"
      [severity]="severity()"
      [size]="size()"
      [touched]="touched()"
    />
  `,
})
class CheckboxHost {
  public readonly dirty: WritableSignal<boolean> = signal<boolean>(false);
  public readonly disabled: WritableSignal<boolean> = signal<boolean>(false);
  public readonly indeterminate: WritableSignal<boolean> = signal<boolean>(false);
  public readonly invalid: WritableSignal<boolean> = signal<boolean>(false);
  public readonly severity: WritableSignal<FormControlSeverity | null> = signal<FormControlSeverity | null>(null);
  public readonly size: WritableSignal<FormControlSize> = signal<FormControlSize>('md');
  public readonly touched: WritableSignal<boolean> = signal<boolean>(false);
}

describe('Checkbox native behavior', (): void => {
  it('preserves native checkbox and disabled behavior', (): void => {
    const fixture: ComponentFixture<CheckboxHost> = render(CheckboxHost);
    const checkbox: HTMLInputElement = query(fixture, 'input');

    checkbox.click();
    expect(checkbox.checked).toBe(true);

    fixture.componentInstance.disabled.set(true);
    fixture.detectChanges();
    checkbox.click();

    expect(checkbox.disabled).toBe(true);
    expect(checkbox.checked).toBe(true);
  });

  it('reflects the mixed state for assistive technology', (): void => {
    const fixture: ComponentFixture<CheckboxHost> = render(CheckboxHost);
    const checkbox: HTMLInputElement = query(fixture, 'input');
    fixture.componentInstance.indeterminate.set(true);
    fixture.detectChanges();

    expect(checkbox.indeterminate).toBe(true);
    expect(checkbox.getAttribute('aria-checked')).toBe('mixed');
  });
});

describe('Checkbox state', (): void => {
  it('shows invalid state only after interaction', (): void => {
    const fixture: ComponentFixture<CheckboxHost> = render(CheckboxHost);
    const checkbox: HTMLInputElement = query(fixture, 'input');
    fixture.componentInstance.invalid.set(true);
    fixture.detectChanges();

    expect(checkbox.hasAttribute('aria-invalid')).toBe(false);

    fixture.componentInstance.touched.set(true);
    fixture.detectChanges();

    expect(checkbox.getAttribute('aria-invalid')).toBe('true');
    expect(checkbox.classList).toContain('checkbox-error');
  });

  it('maps severity and size to the native control', (): void => {
    const fixture: ComponentFixture<CheckboxHost> = render(CheckboxHost);
    const checkbox: HTMLInputElement = query(fixture, 'input');
    fixture.componentInstance.severity.set('success');
    fixture.componentInstance.size.set('lg');
    fixture.detectChanges();

    expect(checkbox.classList).toContain('checkbox-success');
    expect(checkbox.classList).toContain('checkbox-lg');
  });
});
