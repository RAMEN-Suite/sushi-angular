import { Component, signal, WritableSignal } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { query, render } from '../../../../testing/test-utils';
import { Toggle } from '../toggle.directive';

@Component({
  imports: [Toggle],
  template: `<input type="checkbox" suiToggle severity="info" size="xl" [invalid]="invalid()" [touched]="touched()" />`,
})
class ToggleHost {
  public readonly invalid: WritableSignal<boolean> = signal<boolean>(false);
  public readonly touched: WritableSignal<boolean> = signal<boolean>(false);
}

describe('Toggle', (): void => {
  it('exposes switch semantics, appearance, and delayed invalid state', (): void => {
    const fixture: ComponentFixture<ToggleHost> = render(ToggleHost);
    const toggle: HTMLInputElement = query(fixture, 'input');

    expect(toggle.getAttribute('role')).toBe('switch');
    expect(toggle.classList).toContain('toggle-info');
    expect(toggle.classList).toContain('toggle-xl');

    fixture.componentInstance.invalid.set(true);
    fixture.detectChanges();

    expect(toggle.hasAttribute('aria-invalid')).toBe(false);

    fixture.componentInstance.touched.set(true);
    fixture.detectChanges();

    expect(toggle.getAttribute('aria-invalid')).toBe('true');
    expect(toggle.classList).toContain('toggle-error');
  });
});
