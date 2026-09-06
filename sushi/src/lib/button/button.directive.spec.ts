import { Component, signal, WritableSignal } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { query, render } from '../../../testing/test-utils';
import { Button } from './button.directive';

@Component({
  imports: [Button],
  template: `<button suiButton [disabled]="disabled()" (click)="activations += 1">Save</button>`,
})
class ButtonHost {
  public readonly disabled: WritableSignal<boolean> = signal<boolean>(false);
  public activations: number = 0;
}

describe('Button', (): void => {
  it('applies the default appearance', (): void => {
    const button: HTMLButtonElement = query(render(ButtonHost), 'button');

    expect(button.classList).toContain('sui-button');
    expect(button.classList).toContain('btn-primary');
    expect(button.classList).toContain('btn-md');
  });

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
});
