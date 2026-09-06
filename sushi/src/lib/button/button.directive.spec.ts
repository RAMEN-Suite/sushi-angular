import { Component, signal, WritableSignal } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { query, render } from '../../../testing/test-utils';
import { Button } from './button.directive';
import type { ButtonSeverity, ButtonShape, ButtonSize, ButtonVariant } from './button.interfaces';

interface ClassCase<T> {
  readonly value: T;
  readonly className: string;
}

const variants: readonly ClassCase<ButtonVariant>[] = [
  { value: 'link', className: 'btn-link' },
  { value: 'outlined', className: 'btn-outline' },
  { value: 'soft', className: 'btn-soft' },
  { value: 'dash', className: 'btn-dash' },
  { value: 'text', className: 'btn-ghost' },
];

const shapes: readonly ClassCase<ButtonShape>[] = [
  { value: 'fluid', className: 'btn-block' },
  { value: 'circle', className: 'btn-circle' },
  { value: 'square', className: 'btn-square' },
];

@Component({
  imports: [Button],
  template: `
    <button
      suiButton
      [disabled]="disabled()"
      [loading]="loading()"
      [severity]="severity()"
      [shape]="shape()"
      [size]="size()"
      [variant]="variant()"
      (click)="activations += 1"
    >
      Save
    </button>
  `,
})
class ButtonHost {
  public readonly disabled: WritableSignal<boolean> = signal<boolean>(false);
  public readonly loading: WritableSignal<boolean> = signal<boolean>(false);
  public readonly severity: WritableSignal<ButtonSeverity> = signal<ButtonSeverity>('primary');
  public readonly shape: WritableSignal<ButtonShape | null> = signal<ButtonShape | null>(null);
  public readonly size: WritableSignal<ButtonSize> = signal<ButtonSize>('md');
  public readonly variant: WritableSignal<ButtonVariant | null> = signal<ButtonVariant | null>(null);
  public activations: number = 0;
}

describe('Button defaults', (): void => {
  it('applies the default appearance', (): void => {
    const button: HTMLButtonElement = query(render(ButtonHost), 'button');

    expect(button.classList).toContain('sui-button');
    expect(button.classList).toContain('btn-primary');
    expect(button.classList).toContain('btn-md');
  });
});

describe('Button appearance options', (): void => {
  it('maps every public appearance option', (): void => {
    const fixture: ComponentFixture<ButtonHost> = render(ButtonHost);
    const button: HTMLButtonElement = query(fixture, 'button');
    const severities: readonly ButtonSeverity[] = [
      'primary',
      'secondary',
      'neutral',
      'accent',
      'info',
      'success',
      'warning',
      'error',
    ];
    const sizes: readonly ButtonSize[] = ['xs', 'sm', 'md', 'lg', 'xl'];

    for (const severity of severities) {
      fixture.componentInstance.severity.set(severity);
      fixture.detectChanges();
      expect(button.classList).toContain(`btn-${severity}`);
    }
    for (const size of sizes) {
      fixture.componentInstance.size.set(size);
      fixture.detectChanges();
      expect(button.classList).toContain(`btn-${size}`);
    }
    for (const variant of variants) {
      fixture.componentInstance.variant.set(variant.value);
      fixture.detectChanges();
      expect(button.classList).toContain(variant.className);
    }
    for (const shape of shapes) {
      fixture.componentInstance.shape.set(shape.value);
      fixture.detectChanges();
      expect(button.classList).toContain(shape.className);
    }
  });
});

describe('Button interaction', (): void => {
  it('keeps disabled actions focusable without activating them', (): void => {
    const fixture: ComponentFixture<ButtonHost> = render(ButtonHost);
    const button: HTMLButtonElement = query(fixture, 'button');
    fixture.componentInstance.disabled.set(true);
    fixture.detectChanges();

    button.focus();
    button.click();

    expect(button.hasAttribute('disabled')).toBe(false);
    expect(button.getAttribute('aria-disabled')).toBe('true');
    expect(document.activeElement).toBe(button);
    expect(fixture.componentInstance.activations).toBe(0);
  });

  it('exposes loading state and blocks activation', (): void => {
    const fixture: ComponentFixture<ButtonHost> = render(ButtonHost);
    const button: HTMLButtonElement = query(fixture, 'button');
    fixture.componentInstance.loading.set(true);
    fixture.detectChanges();

    button.click();

    expect(button.getAttribute('aria-busy')).toBe('true');
    expect(button.getAttribute('aria-disabled')).toBe('true');
    expect(button.classList).toContain('sui-button--disabled');
    expect(fixture.componentInstance.activations).toBe(0);
  });
});
