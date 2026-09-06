import { Component, signal, WritableSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { Button } from './button.directive';

@Component({
  imports: [Button],
  template: `<button suiButton [disabled]="disabled()">Save</button>`,
})
class ButtonHost {
  public readonly disabled: WritableSignal<boolean> = signal<boolean>(false);
}

function setup(): ComponentFixture<ButtonHost> {
  const fixture: ComponentFixture<ButtonHost> = TestBed.createComponent(ButtonHost);
  fixture.detectChanges();
  return fixture;
}

function getButton(fixture: ComponentFixture<ButtonHost>): HTMLButtonElement {
  const button: HTMLButtonElement | null = (fixture.nativeElement as HTMLElement).querySelector<HTMLButtonElement>('button');
  if (button === null) throw new Error('Expected the button host to render a button.');
  return button;
}

describe('Button', (): void => {
  it('applies the default appearance', (): void => {
    const button: HTMLButtonElement = getButton(setup());

    expect(button.classList).toContain('sui-button');
    expect(button.classList).toContain('btn-primary');
    expect(button.classList).toContain('btn-md');
  });

  it('keeps disabled actions focusable without activating them', (): void => {
    const fixture: ComponentFixture<ButtonHost> = setup();
    const button: HTMLButtonElement = getButton(fixture);
    fixture.componentInstance.disabled.set(true);
    fixture.detectChanges();

    button.focus();

    expect(button.hasAttribute('disabled')).toBe(false);
    expect(button.getAttribute('aria-disabled')).toBe('true');
    expect(document.activeElement).toBe(button);
  });
});
