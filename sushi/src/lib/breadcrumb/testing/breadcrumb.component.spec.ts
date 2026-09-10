import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { beforeEach, describe, expect, it } from 'vitest';
import { query, queryAll, render } from '../../../../testing/test-utils';
import { Breadcrumb } from '../breadcrumb.component';
import { BreadcrumbItem } from '../breadcrumb.interfaces';
import { BreadcrumbItemTemplate } from '../breadcrumb.templates';

@Component({
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
});
