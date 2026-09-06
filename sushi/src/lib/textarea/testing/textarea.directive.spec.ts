import { Component, signal, WritableSignal } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { query, render } from '../../../../testing/test-utils';
import { Textarea } from '../textarea.directive';
import type { TextareaResize } from '../textarea.interfaces';

@Component({
  imports: [Textarea],
  template: `
    <textarea
      suiTextarea
      [fluid]="fluid()"
      [invalid]="invalid()"
      [resize]="resize()"
      [severity]="severity()"
      [size]="size()"
      [touched]="touched()"
    ></textarea>
  `,
})
class TextareaHost {
  public readonly fluid: WritableSignal<boolean> = signal<boolean>(false);
  public readonly invalid: WritableSignal<boolean> = signal<boolean>(false);
  public readonly resize: WritableSignal<TextareaResize> = signal<TextareaResize>('vertical');
  public readonly severity: WritableSignal<'accent' | null> = signal<'accent' | null>(null);
  public readonly size: WritableSignal<'md' | 'sm'> = signal<'md' | 'sm'>('md');
  public readonly touched: WritableSignal<boolean> = signal<boolean>(false);
}

describe('Textarea', (): void => {
  it('preserves native multiline editing', (): void => {
    const textarea: HTMLTextAreaElement = query(render(TextareaHost), 'textarea');
    textarea.value = 'First line\nSecond line';
    textarea.dispatchEvent(new Event('input', { bubbles: true }));

    expect(textarea.value).toBe('First line\nSecond line');
  });

  it('maps every supported resize direction', (): void => {
    const fixture: ComponentFixture<TextareaHost> = render(TextareaHost);
    const textarea: HTMLTextAreaElement = query(fixture, 'textarea');
    const resizeClasses: Readonly<Record<TextareaResize, string>> = {
      none: 'resize-none',
      vertical: 'resize-y',
      horizontal: 'resize-x',
      both: 'resize',
    };

    for (const [resize, className] of Object.entries(resizeClasses) as [TextareaResize, string][]) {
      fixture.componentInstance.resize.set(resize);
      fixture.detectChanges();
      expect(textarea.classList).toContain(className);
    }
  });

  it('maps layout, appearance, and delayed invalid state', (): void => {
    const fixture: ComponentFixture<TextareaHost> = render(TextareaHost);
    const textarea: HTMLTextAreaElement = query(fixture, 'textarea');
    fixture.componentInstance.fluid.set(true);
    fixture.componentInstance.severity.set('accent');
    fixture.componentInstance.size.set('sm');
    fixture.componentInstance.invalid.set(true);
    fixture.detectChanges();

    expect(textarea.classList).toContain('w-full');
    expect(textarea.classList).toContain('textarea-accent');
    expect(textarea.classList).toContain('textarea-sm');
    expect(textarea.hasAttribute('aria-invalid')).toBe(false);

    fixture.componentInstance.touched.set(true);
    fixture.detectChanges();
    expect(textarea.getAttribute('aria-invalid')).toBe('true');
    expect(textarea.classList).toContain('textarea-error');
  });
});
