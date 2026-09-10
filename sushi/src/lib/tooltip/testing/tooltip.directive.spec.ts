import { Component, DebugElement } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { describe, expect, it } from 'vitest';
import { render } from '../../../../testing/test-utils';
import { Tooltip } from '../tooltip.directive';

@Component({ imports: [Tooltip], template: `<button suiTooltip="Helpful details" [offset]="10">Help</button>` })
class Host {}

describe('Tooltip', (): void => {
  it('associates its visible surface with the target', (): void => {
    const fixture: ComponentFixture<Host> = render(Host);
    const target: DebugElement = fixture.debugElement.query(By.directive(Tooltip));
    target.injector.get(Tooltip).show();
    fixture.detectChanges();
    const button: HTMLButtonElement = target.nativeElement as HTMLButtonElement;
    const tooltip: Element | null = document.querySelector('[role="tooltip"]');
    expect(tooltip?.textContent).toBe('Helpful details');
    expect(tooltip?.getAttribute('data-placement')).toBe('top');
    expect(button.getAttribute('aria-describedby')).toBe(tooltip?.id);
  });
});
