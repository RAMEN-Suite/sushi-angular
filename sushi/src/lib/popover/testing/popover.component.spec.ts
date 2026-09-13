import { Component, signal, Signal, viewChild, WritableSignal } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';
import { afterEach, describe, expect, it } from 'vitest';
import { query, render, press } from '../../../../testing/test-utils';
import { Popover } from '../popover.component';
import { PopoverTrigger } from '../popover-trigger.directive';

@Component({
  imports: [Popover, PopoverTrigger],
  template: `<button [suiPopoverTrigger]="popover" [disabled]="disabled()">Details</button
    ><sui-popover #popover ariaLabel="Details">Content</sui-popover>`,
})
class Host {
  public readonly disabled: WritableSignal<boolean> = signal(false);
}

@Component({
  imports: [Popover, PopoverTrigger],
  template: `<button [suiPopoverTrigger]="popover">Share</button
    ><sui-popover #popover ariaLabel="Share" showCloseButton>Content</sui-popover>`,
})
class ClosableHost {}

@Component({
  imports: [Popover, PopoverTrigger],
  template: `<button [suiPopoverTrigger]="popover">Options</button
    ><sui-popover #popover ariaLabel="Options" [autoFocus]="false" [closeOnEscape]="false" [dismissible]="false"
      >Content</sui-popover
    >`,
})
class PersistentHost {
  public readonly popover: Signal<Popover> = viewChild.required<Popover>('popover');
}

afterEach((): void => document.querySelector('.cdk-overlay-container')?.remove());

describe('Popover dismissal', (): void => {
  it('opens from its trigger and closes with Escape', async (): Promise<void> => {
    const fixture: ComponentFixture<Host> = render(Host);
    const trigger: HTMLButtonElement = query(fixture, 'button');
    trigger.click();
    fixture.detectChanges();
    await Promise.resolve();
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    const surface: Element | null = document.querySelector('[role="dialog"]');
    if (!surface) throw new Error('Expected the Popover surface to be visible.');
    expect(surface.textContent).toContain('Content');
    expect(document.activeElement).toBe(surface);
    press(surface, 'Escape');
    fixture.detectChanges();
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
  });

  it('can render a built-in close action and restore trigger focus', (): void => {
    const fixture: ComponentFixture<ClosableHost> = render(ClosableHost);
    const trigger: HTMLButtonElement = query(fixture, 'button');
    trigger.click();
    fixture.detectChanges();

    const close: HTMLButtonElement | null = document.querySelector('button[aria-label="Close"]');
    if (!close) throw new Error('Expected the Popover close action to be visible.');
    close.click();
    fixture.detectChanges();

    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(document.activeElement).toBe(trigger);
  });
});

describe('Popover opt-outs', (): void => {
  it('keeps a persistent Popover open without stealing focus', async (): Promise<void> => {
    const fixture: ComponentFixture<PersistentHost> = render(PersistentHost);
    const trigger: HTMLButtonElement = query(fixture, 'button');
    trigger.focus();
    trigger.click();
    fixture.detectChanges();
    await Promise.resolve();

    const surface: HTMLElement | null = document.querySelector('[role="dialog"]');
    if (!surface) throw new Error('Expected the Popover surface to be visible.');
    expect(document.activeElement).toBe(trigger);

    press(surface, 'Escape');
    fixture.detectChanges();
    expect(fixture.componentInstance.popover().open()).toBe(true);
  });

  it('keeps a disabled trigger focusable without opening', (): void => {
    const fixture: ComponentFixture<Host> = render(Host);
    const trigger: HTMLButtonElement = query(fixture, 'button');
    fixture.componentInstance.disabled.set(true);
    fixture.detectChanges();
    trigger.focus();
    trigger.click();

    expect(trigger.disabled).toBe(false);
    expect(trigger.getAttribute('aria-disabled')).toBe('true');
    expect(document.activeElement).toBe(trigger);
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
  });
});
