import { Component, signal, WritableSignal } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { query, render } from '../../../../testing/test-utils';
import { ToggleButton } from '../toggle-button.component';
import { ToggleButtonOffTemplate, ToggleButtonOnTemplate, ToggleButtonTemplate } from '../toggle-button.templates';

@Component({
  imports: [ToggleButton, ToggleButtonOffTemplate, ToggleButtonOnTemplate],
  template: `
    <sui-toggle-button
      ariaLabel="Pin item"
      [disabled]="disabled()"
      [loading]="loading()"
      [(checked)]="checked"
      (touch)="touches += 1"
    >
      <ng-template suiToggleButtonOn><span data-on>Pinned</span></ng-template>
      <ng-template suiToggleButtonOff><span data-off>Pin</span></ng-template>
    </sui-toggle-button>
  `,
})
class ToggleButtonHost {
  public readonly checked: WritableSignal<boolean> = signal<boolean>(false);
  public readonly disabled: WritableSignal<boolean> = signal<boolean>(false);
  public readonly loading: WritableSignal<boolean> = signal<boolean>(false);
  public touches: number = 0;
}

@Component({
  imports: [ToggleButton, ToggleButtonTemplate],
  template: `
    <sui-toggle-button [(checked)]="checked">
      <ng-template suiToggleButton let-checked let-toggle="toggle" let-touch="touch">
        <button data-custom type="button" [attr.aria-pressed]="checked" (click)="toggle()" (blur)="touch()">
          {{ checked ? 'Custom on' : 'Custom off' }}
        </button>
      </ng-template>
    </sui-toggle-button>
  `,
})
class CustomToggleButtonHost {
  public readonly checked: WritableSignal<boolean> = signal<boolean>(false);
}

describe('ToggleButton default control', (): void => {
  it('toggles its model and state-specific templates', (): void => {
    const fixture: ComponentFixture<ToggleButtonHost> = render(ToggleButtonHost);
    const button: HTMLButtonElement = query(fixture, 'button');
    expect(button.getAttribute('aria-pressed')).toBe('false');
    expect(query(fixture, '[data-off]').textContent).toBe('Pin');

    button.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.checked()).toBe(true);
    expect(button.getAttribute('aria-pressed')).toBe('true');
    expect(query(fixture, '[data-on]').textContent).toBe('Pinned');
  });

  it('emits touch on blur', (): void => {
    const fixture: ComponentFixture<ToggleButtonHost> = render(ToggleButtonHost);
    query(fixture, 'button').dispatchEvent(new FocusEvent('blur'));
    expect(fixture.componentInstance.touches).toBe(1);
  });
});

describe('ToggleButton guarded states', (): void => {
  it('keeps a disabled control focusable without toggling', (): void => {
    const fixture: ComponentFixture<ToggleButtonHost> = render(ToggleButtonHost);
    const button: HTMLButtonElement = query(fixture, 'button');
    fixture.componentInstance.disabled.set(true);
    fixture.detectChanges();

    button.focus();
    button.click();
    expect(document.activeElement).toBe(button);
    expect(fixture.componentInstance.checked()).toBe(false);
    expect(query(fixture, 'sui-toggle-button').classList).toContain('cursor-not-allowed');
  });

  it('blocks toggling while loading', (): void => {
    const fixture: ComponentFixture<ToggleButtonHost> = render(ToggleButtonHost);
    const button: HTMLButtonElement = query(fixture, 'button');
    fixture.componentInstance.loading.set(true);
    fixture.detectChanges();
    button.click();

    expect(fixture.componentInstance.checked()).toBe(false);
    expect(button.getAttribute('aria-busy')).toBe('true');
  });
});

describe('ToggleButton custom control', (): void => {
  it('delegates behavior through the complete template context', (): void => {
    const fixture: ComponentFixture<CustomToggleButtonHost> = render(CustomToggleButtonHost);
    const button: HTMLButtonElement = query(fixture, 'button');
    button.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.checked()).toBe(true);
    expect(button.textContent.trim()).toBe('Custom on');
  });
});
