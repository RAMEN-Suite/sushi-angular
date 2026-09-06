import { Component, signal, WritableSignal } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { query, render } from '../../../../testing/test-utils';
import { Badge } from '../badge.directive';
import type { BadgeSeverity, BadgeSize, BadgeVariant } from '../badge.interfaces';

@Component({
  imports: [Badge],
  template: `<span suiBadge [severity]="severity()" [variant]="variant()" [size]="size()">New</span>`,
})
class BadgeHost {
  public readonly severity: WritableSignal<BadgeSeverity> = signal<BadgeSeverity>('primary');
  public readonly variant: WritableSignal<BadgeVariant | null> = signal<BadgeVariant | null>(null);
  public readonly size: WritableSignal<BadgeSize> = signal<BadgeSize>('md');
}

describe('Badge', (): void => {
  it('styles a non-interactive native label', (): void => {
    const fixture: ComponentFixture<BadgeHost> = render(BadgeHost);
    fixture.componentInstance.severity.set('success');
    fixture.componentInstance.variant.set('soft');
    fixture.componentInstance.size.set('sm');
    fixture.detectChanges();
    const badge: Element = query(fixture, '[suiBadge]');
    expect(badge.classList).toContain('badge-success');
    expect(badge.classList).toContain('badge-soft');
    expect(badge.classList).toContain('badge-sm');
    expect(badge.hasAttribute('role')).toBe(false);
  });
});
