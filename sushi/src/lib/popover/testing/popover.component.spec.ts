import { Component } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { query, render, press } from '../../../../testing/test-utils';
import { Popover } from '../popover.component';
import { PopoverTrigger } from '../popover-trigger.directive';

@Component({
  imports: [Popover, PopoverTrigger],
  template: `<button [suiPopoverTrigger]="popover">Details</button
    ><sui-popover #popover ariaLabel="Details">Content</sui-popover>`,
})
class Host {}

@Component({
  imports: [Popover, PopoverTrigger],
  template: `<button [suiPopoverTrigger]="popover">Share</button
    ><sui-popover #popover ariaLabel="Share" showCloseButton>Content</sui-popover>`,
})
class ClosableHost {}

describe('Popover', (): void => {
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
