import { Component, signal, WritableSignal } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { press, query, queryAll, render } from '../../../../testing/test-utils';
import { Pagination } from '../pagination.component';
import { PaginationVariant } from '../pagination.interfaces';
import { PaginationNavigationTemplate, PaginationPageTemplate, PaginationReportTemplate } from '../pagination.templates';

@Component({
  imports: [Pagination, PaginationNavigationTemplate, PaginationPageTemplate, PaginationReportTemplate],
  template: `
    <sui-pagination
      ariaLabel="Results"
      showPageInput
      showReport
      [disabled]="disabled()"
      [pageLinkSize]="3"
      [pageSizeOptions]="[10, 25]"
      [totalItems]="95"
      [variant]="variant()"
      [(page)]="page"
      [(pageSize)]="pageSize"
    >
      <ng-template suiPaginationPage let-page let-current="current">
        <span [attr.data-page]="page" [attr.data-current]="current">{{ page }}</span>
      </ng-template>
      <ng-template suiPaginationNavigation let-navigation let-label="label">
        <span [attr.data-navigation]="navigation">{{ label }}</span>
      </ng-template>
      <ng-template suiPaginationReport let-firstItem="firstItem" let-lastItem="lastItem">
        <span data-report>{{ firstItem }} to {{ lastItem }}</span>
      </ng-template>
    </sui-pagination>
  `,
})
class PaginationHost {
  public readonly disabled: WritableSignal<boolean> = signal<boolean>(false);
  public readonly page: WritableSignal<number> = signal<number>(5);
  public readonly pageSize: WritableSignal<number> = signal<number>(10);
  public readonly variant: WritableSignal<PaginationVariant> = signal<PaginationVariant>('plain');
}

describe('Pagination range and templates', (): void => {
  it('renders a centered page window and report context', (): void => {
    const fixture: ComponentFixture<PaginationHost> = render(PaginationHost);
    const pages: readonly Element[] = queryAll(fixture, '[data-page]');

    expect(pages.map((page: Element): string | null => page.getAttribute('data-page'))).toEqual(['4', '5', '6']);
    expect(query(fixture, '[data-page="5"]').getAttribute('data-current')).toBe('true');
    expect(query(fixture, '[data-report]').textContent).toBe('41 to 50');
    expect(queryAll(fixture, '[data-navigation]')).toHaveLength(4);
    expect(query(fixture, '[role="navigation"]').getAttribute('aria-label')).toBe('Results');
  });

  it('clamps an externally requested page to the available range', (): void => {
    const fixture: ComponentFixture<PaginationHost> = render(PaginationHost);
    fixture.componentInstance.page.set(99);
    fixture.detectChanges();

    expect(query(fixture, '[aria-current="page"] [data-page]').getAttribute('data-page')).toBe('10');
    expect(query(fixture, '[data-report]').textContent).toBe('91 to 95');
  });
});

describe('Pagination appearance', (): void => {
  it('renders separate round actions by default and a connected group on request', (): void => {
    const fixture: ComponentFixture<PaginationHost> = render(PaginationHost);
    const pagination: Element = query(fixture, '[role="navigation"]');

    expect(pagination.classList).toContain('sui-pagination--plain');
    expect(query(fixture, '[aria-label="Previous page"]').classList).toContain('btn-circle');

    fixture.componentInstance.variant.set('joined');
    fixture.detectChanges();

    expect(pagination.classList).toContain('sui-pagination--joined');
    expect(query(fixture, '.join')).toBeTruthy();
    expect(queryAll(fixture, '.join-item')).toHaveLength(7);
    expect(query(fixture, '[aria-label="Previous page"]').classList).not.toContain('btn-circle');
    expect(query(fixture, '[aria-label="Previous page"]').classList).toContain('btn-soft');

    query(fixture, '[aria-current="page"]').dispatchEvent(new MouseEvent('click', { bubbles: true }));
    fixture.detectChanges();
    expect(query(fixture, 'input').classList).toContain('join-item');
  });
});

describe('Pagination navigation', (): void => {
  it('moves through previous, next, first, and last actions', (): void => {
    const fixture: ComponentFixture<PaginationHost> = render(PaginationHost);
    query(fixture, '[aria-label="Next page"]').dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(fixture.componentInstance.page()).toBe(6);

    query(fixture, '[aria-label="Last page"]').dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(fixture.componentInstance.page()).toBe(10);

    query(fixture, '[aria-label="First page"]').dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(fixture.componentInstance.page()).toBe(1);
  });

  it('edits the current page inline and commits with Enter', (): void => {
    const fixture: ComponentFixture<PaginationHost> = render(PaginationHost);
    query(fixture, '[aria-current="page"]').dispatchEvent(new MouseEvent('click', { bubbles: true }));
    fixture.detectChanges();
    const input: HTMLInputElement = query(fixture, 'input');
    input.value = '8';
    press(input, 'Enter');
    fixture.detectChanges();

    expect(fixture.componentInstance.page()).toBe(8);
    expect(query(fixture, '[aria-current="page"]')).toBeTruthy();
  });

  it('cancels page editing with Escape', (): void => {
    const fixture: ComponentFixture<PaginationHost> = render(PaginationHost);
    query(fixture, '[aria-current="page"]').dispatchEvent(new MouseEvent('click', { bubbles: true }));
    fixture.detectChanges();
    const input: HTMLInputElement = query(fixture, 'input');
    input.value = '9';
    press(input, 'Escape');
    fixture.detectChanges();

    expect(fixture.componentInstance.page()).toBe(5);
    expect(input.value).toBe('5');
  });
});

describe('Pagination disabled state', (): void => {
  it('keeps actions focusable while blocking navigation and editing', (): void => {
    const fixture: ComponentFixture<PaginationHost> = render(PaginationHost);
    const next: HTMLButtonElement = query(fixture, '[aria-label="Next page"]') as HTMLButtonElement;
    fixture.componentInstance.disabled.set(true);
    fixture.detectChanges();
    next.focus();
    next.click();

    expect(document.activeElement).toBe(next);
    expect(next.getAttribute('aria-disabled')).toBe('true');
    expect(fixture.componentInstance.page()).toBe(5);
    expect(queryAll(fixture, 'input')).toHaveLength(0);
  });
});
