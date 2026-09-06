import { Component, signal, WritableSignal } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { press, query, render } from '../../../../testing/test-utils';
import { Chip } from '../chip.component';
import { ChipContentTemplate, ChipRemoveIconTemplate } from '../chip.templates';

@Component({
  imports: [Chip, ChipContentTemplate, ChipRemoveIconTemplate],
  template: `
    <sui-chip
      label="Draft"
      severity="warning"
      variant="soft"
      size="sm"
      removable
      [disabled]="disabled()"
      (remove)="removeCount = removeCount + 1"
    >
      <ng-template suiChipContent let-label let-disabled="disabled">
        <span data-content [attr.data-disabled]="disabled">{{ label }}</span>
      </ng-template>
      <ng-template suiChipRemoveIcon><span data-remove-icon>×</span></ng-template>
    </sui-chip>
  `,
})
class ChipHost {
  public readonly disabled: WritableSignal<boolean> = signal<boolean>(false);
  public removeCount: number = 0;
}

describe('Chip', (): void => {
  it('renders severity, density, and typed content templates', (): void => {
    const fixture: ComponentFixture<ChipHost> = render(ChipHost);
    const chip: Element = query(fixture, 'sui-chip');
    expect(chip.classList).toContain('badge-warning');
    expect(chip.classList).toContain('badge-soft');
    expect(chip.classList).toContain('sui-chip--sm');
    expect(query(fixture, '[data-content]').textContent).toBe('Draft');
    expect(query(fixture, '[data-remove-icon]').textContent).toBe('×');
    expect(chip.getAttribute('aria-label')).toBe('Remove Draft');
  });

  it('removes once from pointer or keyboard activation', (): void => {
    const fixture: ComponentFixture<ChipHost> = render(ChipHost);
    query(fixture, '.sui-chip__remove').dispatchEvent(new MouseEvent('click', { bubbles: true }));
    fixture.detectChanges();
    expect(fixture.componentInstance.removeCount).toBe(1);
    expect(query(fixture, 'sui-chip').classList).toContain('hidden');
    press(query(fixture, 'sui-chip'), 'Enter');
    expect(fixture.componentInstance.removeCount).toBe(1);
  });

  it('keeps a disabled removable chip focusable while blocking removal', (): void => {
    const fixture: ComponentFixture<ChipHost> = render(ChipHost);
    fixture.componentInstance.disabled.set(true);
    fixture.detectChanges();
    const chip: HTMLElement = query(fixture, 'sui-chip') as HTMLElement;
    chip.focus();
    press(chip, 'Backspace');
    expect(document.activeElement).toBe(chip);
    expect(chip.getAttribute('aria-disabled')).toBe('true');
    expect(fixture.componentInstance.removeCount).toBe(0);
  });
});
