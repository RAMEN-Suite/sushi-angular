import { Component, signal, WritableSignal } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { query, render } from '../../../../testing/test-utils';
import type { FormControlSeverity, FormControlSize } from '../../form-control';
import { FileInput } from '../file-input.directive';

@Component({
  imports: [FileInput],
  template: `
    <input
      suiFileInput
      type="file"
      [dirty]="dirty()"
      [fluid]="fluid()"
      [invalid]="invalid()"
      [severity]="severity()"
      [size]="size()"
      [touched]="touched()"
    />
  `,
})
class FileInputHost {
  public readonly dirty: WritableSignal<boolean> = signal<boolean>(false);
  public readonly fluid: WritableSignal<boolean> = signal<boolean>(false);
  public readonly invalid: WritableSignal<boolean> = signal<boolean>(false);
  public readonly severity: WritableSignal<FormControlSeverity | null> = signal<FormControlSeverity | null>(null);
  public readonly size: WritableSignal<FormControlSize> = signal<FormControlSize>('md');
  public readonly touched: WritableSignal<boolean> = signal<boolean>(false);
}

describe('FileInput', (): void => {
  it('preserves native file-input semantics and maps configured appearance', (): void => {
    const fixture: ComponentFixture<FileInputHost> = render(FileInputHost);
    const input: HTMLInputElement = query(fixture, 'input');
    fixture.componentInstance.fluid.set(true);
    fixture.componentInstance.severity.set('secondary');
    fixture.componentInstance.size.set('sm');
    fixture.detectChanges();

    expect(input.type).toBe('file');
    expect(input.classList.contains('file-input')).toBe(true);
    expect(input.classList.contains('file-input-secondary')).toBe(true);
    expect(input.classList.contains('file-input-sm')).toBe(true);
    expect(input.classList.contains('w-full')).toBe(true);
  });

  it('delays invalid state until the control is touched or dirty', (): void => {
    const fixture: ComponentFixture<FileInputHost> = render(FileInputHost);
    const input: HTMLInputElement = query(fixture, 'input');
    fixture.componentInstance.invalid.set(true);
    fixture.detectChanges();
    expect(input.hasAttribute('aria-invalid')).toBe(false);

    fixture.componentInstance.dirty.set(true);
    fixture.detectChanges();
    expect(input.getAttribute('aria-invalid')).toBe('true');
  });
});
