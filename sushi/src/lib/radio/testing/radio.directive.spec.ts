import { Component, signal, WritableSignal } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { queryAll, render } from '../../../../testing/test-utils';
import { Radio } from '../radio.directive';

@Component({
  imports: [Radio],
  template: `
    <input type="radio" suiRadio name="choice" value="first" [dirty]="dirty()" [invalid]="invalid()" />
    <input type="radio" suiRadio name="choice" value="second" severity="warning" size="sm" />
  `,
})
class RadioHost {
  public readonly dirty: WritableSignal<boolean> = signal<boolean>(false);
  public readonly invalid: WritableSignal<boolean> = signal<boolean>(false);
}

describe('Radio', (): void => {
  it('preserves native mutually exclusive selection', (): void => {
    const fixture: ComponentFixture<RadioHost> = render(RadioHost);
    const radios: readonly HTMLInputElement[] = queryAll(fixture, 'input');
    const first: HTMLInputElement = radios[0];
    const second: HTMLInputElement = radios[1];

    first.click();
    expect(first.checked).toBe(true);
    expect(second.checked).toBe(false);

    second.click();
    expect(first.checked).toBe(false);
    expect(second.checked).toBe(true);
  });

  it('maps appearance and delayed invalid state', (): void => {
    const fixture: ComponentFixture<RadioHost> = render(RadioHost);
    const radios: readonly HTMLInputElement[] = queryAll(fixture, 'input');
    const first: HTMLInputElement = radios[0];
    const second: HTMLInputElement = radios[1];

    expect(second.classList).toContain('radio-warning');
    expect(second.classList).toContain('radio-sm');

    fixture.componentInstance.invalid.set(true);
    fixture.detectChanges();
    expect(first.hasAttribute('aria-invalid')).toBe(false);

    fixture.componentInstance.dirty.set(true);
    fixture.detectChanges();
    expect(first.getAttribute('aria-invalid')).toBe('true');
    expect(first.classList).toContain('radio-error');
  });
});
