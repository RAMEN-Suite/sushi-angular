import { Component, signal, WritableSignal } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { query, render } from '../../../testing/test-utils';
import { Range } from './range.directive';

@Component({
  imports: [Range],
  template: `
    <input
      type="range"
      suiRange
      min="20"
      max="60"
      value="40"
      [dirty]="dirty()"
      [invalid]="invalid()"
      [severity]="severity()"
      [size]="size()"
    />
  `,
})
class RangeHost {
  public readonly dirty: WritableSignal<boolean> = signal<boolean>(false);
  public readonly invalid: WritableSignal<boolean> = signal<boolean>(false);
  public readonly severity: WritableSignal<'secondary' | null> = signal<'secondary' | null>(null);
  public readonly size: WritableSignal<'md' | 'xs'> = signal<'md' | 'xs'>('md');
}

describe('Range', (): void => {
  it('reflects native range progress after input', (): void => {
    const range: HTMLInputElement = query(render(RangeHost), 'input');
    range.value = '50';
    range.dispatchEvent(new Event('input', { bubbles: true }));

    expect(range.style.getPropertyValue('--sui-range-progress')).toBe('75%');
  });

  it('maps appearance and delayed invalid state', (): void => {
    const fixture: ComponentFixture<RangeHost> = render(RangeHost);
    const range: HTMLInputElement = query(fixture, 'input');
    fixture.componentInstance.severity.set('secondary');
    fixture.componentInstance.size.set('xs');
    fixture.componentInstance.invalid.set(true);
    fixture.detectChanges();

    expect(range.classList).toContain('range-secondary');
    expect(range.classList).toContain('range-xs');
    expect(range.hasAttribute('aria-invalid')).toBe(false);

    fixture.componentInstance.dirty.set(true);
    fixture.detectChanges();
    expect(range.getAttribute('aria-invalid')).toBe('true');
    expect(range.classList).toContain('range-error');
  });
});
