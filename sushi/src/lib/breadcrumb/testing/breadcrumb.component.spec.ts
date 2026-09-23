import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { beforeEach, describe, expect, it } from 'vitest';
import { query, queryAll, render } from '../../../../testing/test-utils';
import { Breadcrumb } from '../breadcrumb.component';
import { BreadcrumbItem } from '../breadcrumb.interfaces';
import { BreadcrumbItemTemplate } from '../breadcrumb.templates';

@Component({
  selector: 'sui-test-breadcrumb-host',
  imports: [Breadcrumb, BreadcrumbItemTemplate],
  template: `<sui-breadcrumb [items]="items"
    ><ng-template suiBreadcrumbItem let-item>{{ item.label }}</ng-template></sui-breadcrumb
  >`,
})
class BreadcrumbHost {
  public readonly items: readonly BreadcrumbItem<number>[] = [
    { value: 1, label: 'Home', routerLink: '/' },
    { value: 2, label: 'Library', href: '/library' },
    { value: 3, label: 'Current' },
  ];
}

@Component({
  selector: 'sui-test-explicit-current-host',
  imports: [Breadcrumb, BreadcrumbItemTemplate],
  template: `<sui-breadcrumb [items]="items">
    <ng-template suiBreadcrumbItem let-item let-index="index" let-current="current">
      <span [attr.data-value]="item.value" [attr.data-index]="index" [attr.data-current]="current">{{ item.label }}</span>
    </ng-template>
  </sui-breadcrumb>`,
})
class ExplicitCurrentHost {
  public readonly items: readonly BreadcrumbItem<number>[] = [
    { value: 1, label: 'Home', routerLink: '/' },
    { value: 2, label: 'Library', href: '/library', current: true },
    { value: 3, label: 'Current', current: false },
  ];
}

describe('Breadcrumb', (): void => {
  beforeEach((): void => {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
  });

  it('renders linked ancestors and one current page in a named landmark', (): void => {
    const fixture: ComponentFixture<BreadcrumbHost> = render(BreadcrumbHost);
    expect(query(fixture, 'nav').getAttribute('aria-label')).toBe('Breadcrumb');
    expect(queryAll(fixture, 'a')).toHaveLength(2);
    expect(query(fixture, '[aria-current="page"]').textContent).toBe('Current');
  });

  it('honors an explicit current item and exposes complete template context', (): void => {
    const fixture: ComponentFixture<ExplicitCurrentHost> = render(ExplicitCurrentHost);

    const currentItems: readonly Element[] = queryAll(fixture, '[aria-current="page"]');
    expect(currentItems.map((item: Element): string => item.textContent.trim())).toEqual(['Library']);
    expect(query(fixture, '[data-value="3"]').getAttribute('data-index')).toBe('2');
    expect(query(fixture, '[data-value="3"]').getAttribute('data-current')).toBe('false');
  });
});
