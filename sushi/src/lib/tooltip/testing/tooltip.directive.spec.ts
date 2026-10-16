import { FocusMonitor } from '@angular/cdk/a11y';
import { Component, type DebugElement, signal, viewChild, type Signal, type WritableSignal } from '@angular/core';
import { type ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { render } from '../../../../testing/test-utils';
import { Menu, MenuTrigger } from '../../menu';
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

describe('Tooltip description ownership', (): void => {
  it('preserves existing descriptions when hiding before opening or hiding repeatedly', (): void => {
    const fixture: ComponentFixture<Host> = render(Host);
    const target: DebugElement = fixture.debugElement.query(By.directive(Tooltip));
    const tooltip: Tooltip = target.injector.get(Tooltip);
    const button: HTMLButtonElement = target.nativeElement as HTMLButtonElement;
    tooltip.hide();

    expect(button.getAttribute('aria-describedby')).toBe('existing-description');

    tooltip.show();
    fixture.detectChanges();
    tooltip.hide();
    tooltip.hide();

    expect(button.getAttribute('aria-describedby')).toBe('existing-description');
  });
});

@Component({
  imports: [Tooltip, Menu, MenuTrigger],
  template: `
    <button suiTooltip="Menu help" [suiMenuTrigger]="menu">Commands</button>
    <sui-menu #menu popup [items]="[{ label: 'Save', value: 'save' }]" />
  `,
})
class MenuHost {
  public readonly menu: Signal<Menu> = viewChild.required(Menu);
}

describe('Tooltip activation', (): void => {
  it('cancels pending hover and immediately hides visible help on activation', (): void => {
    vi.useFakeTimers();
    const fixture: ComponentFixture<Host> = render(Host);
    const target: DebugElement = fixture.debugElement.query(By.directive(Tooltip));
    const button: HTMLButtonElement = target.nativeElement as HTMLButtonElement;
    button.dispatchEvent(new MouseEvent('mouseenter'));
    button.dispatchEvent(new Event('pointerdown', { bubbles: true }));
    vi.advanceTimersByTime(300);

    expect(document.querySelector('[role="tooltip"]')).toBeNull();

    target.injector.get(Tooltip).show();
    fixture.detectChanges();
    expect(document.querySelector('[role="tooltip"]')).not.toBeNull();

    button.click();

    expect(document.querySelector('[role="tooltip"]')).toBeNull();
  });
});

describe('Tooltip disabling', (): void => {
  it('hides while disabled and requires fresh hover after re-enabling', (): void => {
    vi.useFakeTimers();
    const fixture: ComponentFixture<Host> = render(Host);
    const tooltip: Tooltip = fixture.debugElement.query(By.directive(Tooltip)).injector.get(Tooltip);
    tooltip.show();
    fixture.detectChanges();
    fixture.componentInstance.disabled.set(true);
    fixture.detectChanges();
    tooltip.show();

    expect(document.querySelector('[role="tooltip"]')).toBeNull();

    fixture.componentInstance.disabled.set(false);
    fixture.detectChanges();
    vi.advanceTimersByTime(300);

    expect(document.querySelector('[role="tooltip"]')).toBeNull();

    const button: HTMLButtonElement = fixture.debugElement.query(By.directive(Tooltip)).nativeElement as HTMLButtonElement;
    button.dispatchEvent(new MouseEvent('mouseleave'));
    button.dispatchEvent(new MouseEvent('mouseenter'));
    vi.advanceTimersByTime(300);
    fixture.detectChanges();

    expect(document.querySelector('[role="tooltip"]')).not.toBeNull();
  });
});

describe('Tooltip keyboard reentry', (): void => {
  it('suppresses restored focus until fresh keyboard navigation', (): void => {
    vi.useFakeTimers();
    const fixture: ComponentFixture<Host> = render(Host);
    const target: DebugElement = fixture.debugElement.query(By.directive(Tooltip));
    const button: HTMLButtonElement = target.nativeElement as HTMLButtonElement;
    const monitor: FocusMonitor = target.injector.get(FocusMonitor);
    button.click();
    monitor.focusVia(button, 'keyboard');
    vi.advanceTimersByTime(300);

    expect(document.querySelector('[role="tooltip"]')).toBeNull();

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true }));
    monitor.focusVia(button, 'keyboard');
    vi.advanceTimersByTime(300);
    fixture.detectChanges();

    expect(document.querySelector('[role="tooltip"]')).not.toBeNull();
  });
});

describe('Tooltip overlay coordination', (): void => {
  it('keeps help closed throughout a programmatically opened associated menu', (): void => {
    const fixture: ComponentFixture<MenuHost> = render(MenuHost);
    const target: DebugElement = fixture.debugElement.query(By.directive(Tooltip));
    const tooltip: Tooltip = target.injector.get(Tooltip);
    tooltip.show();
    fixture.detectChanges();
    fixture.componentInstance.menu().open(target.nativeElement as HTMLElement);
    fixture.detectChanges();
    tooltip.show();

    expect(document.querySelector('[role="tooltip"]')).toBeNull();

    fixture.componentInstance.menu().close();
    fixture.detectChanges();

    expect(document.querySelector('[role="tooltip"]')).toBeNull();
  });
});

@Component({ imports: [Tooltip], template: `<input suiTooltip="Text help" />` })
class TextHost {}

describe('Tooltip text controls', (): void => {
  it('does not treat typing a space as button activation', (): void => {
    const fixture: ComponentFixture<TextHost> = render(TextHost);
    const target: DebugElement = fixture.debugElement.query(By.directive(Tooltip));
    target.injector.get(Tooltip).show();
    fixture.detectChanges();
    (target.nativeElement as HTMLInputElement).dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));

    expect(document.querySelector('[role="tooltip"]')).not.toBeNull();
  });
});
