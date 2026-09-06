import { Component, signal, Signal, viewChild, WritableSignal } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { press, query, queryAll, render } from '../../../../testing/test-utils';
import { ColorPicker } from '../color-picker.component';
import type { ColorPickerPresetValue } from '../color-picker.interfaces';
import { ColorPickerPresetTemplate } from '../color-picker.templates';

const presets: readonly ColorPickerPresetValue[] = [
  { label: 'Red', value: '#ff0000' },
  { label: 'Unavailable green', value: '#00ff00', disabled: true },
  { label: 'Blue', value: '#0000ff' },
];

@Component({
  imports: [ColorPicker, ColorPickerPresetTemplate],
  template: `
    <sui-color-picker
      ariaLabel="Accent color"
      defaultValue="#123456"
      [disabled]="disabled()"
      [presets]="presets"
      [(value)]="value"
      (touch)="touches += 1"
    >
      <ng-template
        suiColorPickerPreset
        let-color
        let-label="label"
        let-custom="custom"
        let-selected="selected"
        let-disabled="disabled"
      >
        <span
          [attr.data-preset]="color"
          [attr.data-label]="label"
          [attr.data-custom]="custom"
          [attr.data-selected]="selected"
          [attr.data-disabled]="disabled"
        ></span>
      </ng-template>
    </sui-color-picker>
  `,
})
class ColorPickerHost {
  public readonly control: Signal<ColorPicker> = viewChild.required(ColorPicker);
  public readonly disabled: WritableSignal<boolean> = signal<boolean>(false);
  public readonly value: WritableSignal<string> = signal<string>('#ff0000');
  public readonly presets: readonly ColorPickerPresetValue[] = presets;
  public touches: number = 0;
}

describe('ColorPicker editing', (): void => {
  it('updates its model from valid hex input', (): void => {
    const fixture: ComponentFixture<ColorPickerHost> = render(ColorPickerHost);
    const text: HTMLInputElement = query(fixture, 'input[type="text"]') as HTMLInputElement;
    text.value = '#aabbcc';
    text.dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();

    expect(fixture.componentInstance.value()).toBe('#aabbcc');
    expect(text.value).toBe('#aabbcc');

    text.dispatchEvent(new FocusEvent('blur', { bubbles: true }));
    fixture.detectChanges();
    expect(text.value).toBe('#AABBCC');
  });

  it('keeps an invalid draft and connects its validation message', (): void => {
    const fixture: ComponentFixture<ColorPickerHost> = render(ColorPickerHost);
    const text: HTMLInputElement = query(fixture, 'input[type="text"]') as HTMLInputElement;
    text.value = '#bad';
    text.dispatchEvent(new Event('input', { bubbles: true }));
    text.dispatchEvent(new FocusEvent('blur', { bubbles: true }));
    fixture.detectChanges();

    const alert: Element = query(fixture, '[role="alert"]');
    expect(fixture.componentInstance.value()).toBe('#ff0000');
    expect(text.value).toBe('#bad');
    expect(text.getAttribute('aria-invalid')).toBe('true');
    expect(text.getAttribute('aria-describedby')).toContain(alert.id);
  });

  it('updates from the native color input and clears local validation', (): void => {
    const fixture: ComponentFixture<ColorPickerHost> = render(ColorPickerHost);
    const native: HTMLInputElement = query(fixture, 'input[type="color"]') as HTMLInputElement;
    native.value = '#abcdef';
    native.dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();

    expect(fixture.componentInstance.value()).toBe('#abcdef');
    expect(query(fixture, 'input[type="text"]').getAttribute('aria-invalid')).toBeNull();
  });
});

describe('ColorPicker presets', (): void => {
  it('exposes stable preset state through its template context', (): void => {
    const fixture: ComponentFixture<ColorPickerHost> = render(ColorPickerHost);
    expect(queryAll(fixture, '[role="radio"]')).toHaveLength(4);
    expect(query(fixture, '[data-preset="#ff0000"]').getAttribute('data-selected')).toBe('true');
    expect(query(fixture, '[data-preset="#00ff00"]').getAttribute('data-disabled')).toBe('true');
    expect(query(fixture, '[data-custom="true"]').getAttribute('data-label')).toBe('Custom');
  });

  it('selects enabled presets and skips disabled presets with arrow keys', (): void => {
    const fixture: ComponentFixture<ColorPickerHost> = render(ColorPickerHost);
    const radios: readonly HTMLButtonElement[] = queryAll(fixture, 'button[role="radio"]') as readonly HTMLButtonElement[];
    press(radios[0], 'ArrowRight');
    fixture.detectChanges();

    expect(document.activeElement).toBe(radios[2]);
    expect(fixture.componentInstance.value()).toBe('#0000ff');

    radios[1].click();
    expect(fixture.componentInstance.value()).toBe('#0000ff');
  });
});

describe('ColorPicker public and disabled behavior', (): void => {
  it('focuses the native picker and restores its configured default', (): void => {
    const fixture: ComponentFixture<ColorPickerHost> = render(ColorPickerHost);
    const native: HTMLInputElement = query(fixture, 'input[type="color"]') as HTMLInputElement;
    fixture.componentInstance.control().focus();
    expect(document.activeElement).toBe(native);

    fixture.componentInstance.control().reset();
    fixture.detectChanges();
    expect(fixture.componentInstance.value()).toBe('#123456');
  });

  it('remains focusable while disabled and blocks every color change', (): void => {
    const fixture: ComponentFixture<ColorPickerHost> = render(ColorPickerHost);
    const native: HTMLInputElement = query(fixture, 'input[type="color"]') as HTMLInputElement;
    const text: HTMLInputElement = query(fixture, 'input[type="text"]') as HTMLInputElement;
    fixture.componentInstance.disabled.set(true);
    fixture.detectChanges();

    fixture.componentInstance.control().focus();
    native.value = '#abcdef';
    native.dispatchEvent(new Event('input', { bubbles: true }));
    text.value = '#123123';
    text.dispatchEvent(new Event('input', { bubbles: true }));
    query(fixture, '[data-preset="#0000ff"]').parentElement?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(document.activeElement).toBe(native);
    expect(text.readOnly).toBe(true);
    expect(fixture.componentInstance.value()).toBe('#ff0000');
  });
});
