import { Component, signal, WritableSignal } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { query, render } from '../../../../testing/test-utils';
import { InputSurfaceControl } from '../input-surface-control.directive';
import { InputSurface } from '../input-surface.directive';

@Component({
  imports: [InputSurface, InputSurfaceControl],
  template: `
    <div suiInputSurface severity="info" size="sm" fluid [invalid]="surfaceInvalid()">
      <input suiInputSurfaceControl invalid [touched]="touched()" [showClear]="false" />
    </div>
  `,
})
class InputSurfaceHost {
  public readonly surfaceInvalid: WritableSignal<boolean> = signal<boolean>(false);
  public readonly touched: WritableSignal<boolean> = signal<boolean>(false);
}

describe('InputSurface', (): void => {
  it('styles one fluid surface and its native value control', (): void => {
    const fixture: ComponentFixture<InputSurfaceHost> = render(InputSurfaceHost);
    const surface: Element = query(fixture, '[suiInputSurface]');
    expect(surface.classList).toContain('input-info');
    expect(surface.classList).toContain('input-sm');
    expect(surface.classList).toContain('w-full');
    expect(query(fixture, 'input').classList).toContain('sui-input--clear-hidden');
  });

  it('shows invalid state only after the control is touched', (): void => {
    const fixture: ComponentFixture<InputSurfaceHost> = render(InputSurfaceHost);
    const input: HTMLInputElement = query(fixture, 'input');
    expect(input.hasAttribute('aria-invalid')).toBe(false);
    fixture.componentInstance.touched.set(true);
    fixture.detectChanges();
    expect(input.getAttribute('aria-invalid')).toBe('true');
    fixture.componentInstance.surfaceInvalid.set(true);
    fixture.detectChanges();
    expect(query(fixture, '[suiInputSurface]').classList).toContain('input-error');
  });
});
