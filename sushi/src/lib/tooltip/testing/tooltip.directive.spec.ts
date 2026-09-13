import { Component, DebugElement, signal, WritableSignal } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { render } from '../../../../testing/test-utils';
import { Tooltip } from '../tooltip.directive';

@Component({
  imports: [Tooltip],
  template: `<button
    suiTooltip="Helpful details"
    placement="right"
    [disabled]="disabled()"
    [showDelay]="200"
    [hideDelay]="100"
    [offset]="10"
    aria-describedby="existing-description"
  >
    Help
  </button>`,
})
class Host {
  public readonly disabled: WritableSignal<boolean> = signal(false);
}

afterEach((): void => {
  vi.useRealTimers();
  document.querySelector('.cdk-overlay-container')?.remove();
});

describe('Tooltip', (): void => {
  it('associates its visible surface with the target', (): void => {
    const fixture: ComponentFixture<Host> = render(Host);
    const target: DebugElement = fixture.debugElement.query(By.directive(Tooltip));
    target.injector.get(Tooltip).show();
    fixture.detectChanges();
    const button: HTMLButtonElement = target.nativeElement as HTMLButtonElement;
    const tooltip: Element | null = document.querySelector('[role="tooltip"]');
    expect(tooltip?.textContent).toBe('Helpful details');
    expect(tooltip?.getAttribute('data-placement')).toBe('right');
    expect(button.getAttribute('aria-describedby')).toContain('existing-description');
    expect(button.getAttribute('aria-describedby')).toContain(tooltip?.id);
  });

  it('respects show and hide delays and restores an existing description', (): void => {
    vi.useFakeTimers();
    const fixture: ComponentFixture<Host> = render(Host);
    const button: HTMLButtonElement = fixture.debugElement.query(By.directive(Tooltip)).nativeElement as HTMLButtonElement;

    button.dispatchEvent(new MouseEvent('mouseenter'));
    vi.advanceTimersByTime(199);
    expect(document.querySelector('[role="tooltip"]')).toBeNull();
    vi.advanceTimersByTime(1);
    fixture.detectChanges();
    expect(document.querySelector('[role="tooltip"]')).not.toBeNull();

    button.dispatchEvent(new MouseEvent('mouseleave'));
    vi.advanceTimersByTime(99);
    expect(document.querySelector('[role="tooltip"]')).not.toBeNull();
    vi.advanceTimersByTime(1);
    expect(document.querySelector('[role="tooltip"]')).toBeNull();
    expect(button.getAttribute('aria-describedby')).toBe('existing-description');
  });

  it('does not open while disabled', (): void => {
    const fixture: ComponentFixture<Host> = render(Host);
    const target: DebugElement = fixture.debugElement.query(By.directive(Tooltip));
    fixture.componentInstance.disabled.set(true);
    fixture.detectChanges();

    target.injector.get(Tooltip).show();

    expect(document.querySelector('[role="tooltip"]')).toBeNull();
  });
});
