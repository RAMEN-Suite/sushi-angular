import { Component, signal, WritableSignal } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { press, query, queryAll, render } from '../../../../testing/test-utils';
import { NavbarContent } from '../navbar-content.directive';
import { NavbarItemTemplate } from '../navbar-item-template.directive';
import { Navbar } from '../navbar.component';
import type { NavbarItem, NavbarItemValue } from '../navbar.interfaces';
import { NavbarAction, NavbarBrand } from '../navbar-slot.directive';

const items: readonly NavbarItem[] = [
  { label: 'Overview', value: 'overview', href: '/overview' },
  {
    label: 'Workspace',
    value: 'workspace',
    items: [
      { label: 'Projects', value: 'projects' },
      { label: 'Settings', value: 'settings', disabled: true },
    ],
  },
  { label: 'Activity', value: 'activity' },
  { label: 'Tools', value: 'tools', items: [{ label: 'Reports', value: 'reports' }] },
  { label: 'Unavailable', value: 'unavailable', disabled: true, items: [{ label: 'Hidden', value: 'hidden' }] },
];

@Component({
  imports: [Navbar, NavbarAction, NavbarBrand, NavbarItemTemplate],
  template: `
    <sui-navbar
      ariaLabel="Workspace navigation"
      inset="comfortable"
      menuAlign="center"
      [items]="items"
      [value]="value()"
      (itemSelected)="selected.push($event)"
    >
      <span suiNavbarBrand data-brand>Ramen</span>
      <button suiNavbarAction data-action type="button">Help</button>
      <ng-template [suiNavbarItem]="items" let-item let-level="level">
        <span [attr.data-item]="item.value" [attr.data-level]="level">{{ item.label }}</span>
      </ng-template>
    </sui-navbar>
  `,
})
class NavbarHost {
  public readonly value: WritableSignal<NavbarItemValue | null> = signal<NavbarItemValue | null>('overview');
  public readonly items: readonly NavbarItem[] = items;
  public readonly selected: NavbarItemValue[] = [];
}

@Component({
  imports: [Navbar, NavbarAction, NavbarBrand, NavbarContent],
  template: `
    <sui-navbar ariaLabel="Editor toolbar" collapseAt="md">
      <span suiNavbarBrand>Editor</span>
      <div suiNavbarContent><button data-tool type="button">Select</button></div>
      <button suiNavbarAction type="button">Save</button>
    </sui-navbar>
  `,
})
class CustomNavbarHost {}

function closestButton(element: Element): HTMLButtonElement {
  const button: HTMLButtonElement | null = element.closest<HTMLButtonElement>('button');
  if (button === null) throw new Error('Expected item content to be rendered inside a button.');
  return button;
}

describe('Navbar item model', (): void => {
  it('renders a landmark, native links, actions, current state, and template levels', (): void => {
    const fixture: ComponentFixture<NavbarHost> = render(NavbarHost);
    expect(query(fixture, 'nav').getAttribute('aria-label')).toBe('Workspace navigation');
    expect(query(fixture, '[data-brand]').textContent).toBe('Ramen');
    expect(query(fixture, '[data-action]').textContent).toBe('Help');
    expect(query(fixture, 'nav').classList.contains('sui-navbar--menu-center')).toBe(true);
    expect(query(fixture, 'nav').classList.contains('sui-navbar--comfortable')).toBe(true);
    expect(query(fixture, 'a').getAttribute('href')).toBe('/overview');
    expect(query(fixture, 'a').getAttribute('aria-current')).toBe('page');
    expect(query(fixture, '[data-item="overview"]').getAttribute('data-level')).toBe('0');
    expect(query(fixture, '[data-item="projects"]').getAttribute('data-level')).toBe('1');
  });

  it('emits leaf destinations and closes their disclosure', (): void => {
    const fixture: ComponentFixture<NavbarHost> = render(NavbarHost);
    const details: HTMLDetailsElement = query(fixture, 'details');
    details.open = true;
    fixture.detectChanges();
    const projects: HTMLButtonElement = closestButton(query(fixture, '[data-item="projects"]'));
    projects.click();

    expect(fixture.componentInstance.selected).toEqual(['projects']);
    expect(details.open).toBe(false);
  });

  it('keeps disabled destinations focusable without emitting', (): void => {
    const fixture: ComponentFixture<NavbarHost> = render(NavbarHost);
    const settings: HTMLButtonElement = closestButton(query(fixture, '[data-item="settings"]'));
    settings.focus();
    settings.click();

    expect(document.activeElement).toBe(settings);
    expect(settings.getAttribute('aria-disabled')).toBe('true');
    expect(fixture.componentInstance.selected).toEqual([]);
  });
});

describe('Navbar responsive behavior', (): void => {
  it('connects its toggle to collapsible content', (): void => {
    const fixture: ComponentFixture<NavbarHost> = render(NavbarHost);
    const toggle: HTMLButtonElement = query(fixture, '[aria-label="Toggle navigation"]') as HTMLButtonElement;
    const content: Element = query(fixture, '.sui-navbar__content');

    expect(toggle.getAttribute('aria-controls')).toBe(content.id);
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
    toggle.click();
    fixture.detectChanges();
    expect(toggle.getAttribute('aria-expanded')).toBe('true');
    expect(query(fixture, 'nav').hasAttribute('data-expanded')).toBe(true);
  });

  it('closes responsive content with Escape and restores toggle focus', (): void => {
    const fixture: ComponentFixture<NavbarHost> = render(NavbarHost);
    const toggle: HTMLButtonElement = query(fixture, '[aria-label="Toggle navigation"]') as HTMLButtonElement;
    const content: HTMLElement = query(fixture, '.sui-navbar__content') as HTMLElement;
    toggle.click();
    fixture.detectChanges();
    press(content, 'Escape');
    fixture.detectChanges();

    expect(toggle.getAttribute('aria-expanded')).toBe('false');
    expect(document.activeElement).toBe(toggle);
  });
});

describe('Navbar disclosures', (): void => {
  it('marks a disclosure when one of its children is current', (): void => {
    const fixture: ComponentFixture<NavbarHost> = render(NavbarHost);
    fixture.componentInstance.value.set('projects');
    fixture.detectChanges();
    const workspace: HTMLElement = query(fixture, 'summary');

    expect(workspace.hasAttribute('data-child-current')).toBe(true);
    expect(workspace.hasAttribute('aria-current')).toBe(false);
  });
  it('keeps only the most recently opened disclosure expanded', (): void => {
    const fixture: ComponentFixture<NavbarHost> = render(NavbarHost);
    const details: readonly Element[] = queryAll(fixture, 'details');
    const first: HTMLDetailsElement = details[0] as HTMLDetailsElement;
    const second: HTMLDetailsElement = details[1] as HTMLDetailsElement;
    first.open = true;
    first.dispatchEvent(new Event('toggle'));
    second.open = true;
    second.dispatchEvent(new Event('toggle'));
    expect(first.open).toBe(false);
    expect(second.open).toBe(true);
  });

  it('closes with Escape and returns focus to its summary', (): void => {
    const fixture: ComponentFixture<NavbarHost> = render(NavbarHost);
    const details: HTMLDetailsElement = query(fixture, 'details');
    const summary: HTMLElement = query(fixture, 'summary');
    details.open = true;
    press(details, 'Escape');
    expect(details.open).toBe(false);
    expect(document.activeElement).toBe(summary);
  });

  it('does not open a disabled disclosure', (): void => {
    const fixture: ComponentFixture<NavbarHost> = render(NavbarHost);
    const summaries: readonly Element[] = queryAll(fixture, 'summary');
    const disabled: HTMLElement = summaries[2] as HTMLElement;
    disabled.click();
    expect(disabled.getAttribute('aria-disabled')).toBe('true');
    expect((disabled.parentElement as HTMLDetailsElement).open).toBe(false);
  });
});

describe('Navbar projected content', (): void => {
  it('uses one responsive shell for custom toolbar content', (): void => {
    const fixture: ComponentFixture<CustomNavbarHost> = render(CustomNavbarHost);
    expect(queryAll(fixture, 'nav')).toHaveLength(1);
    expect(query(fixture, '[data-tool]').textContent).toBe('Select');
    expect(query(fixture, '.sui-navbar__content').id).not.toBe('');
    expect(query(fixture, '[aria-label="Toggle navigation"]')).toBeTruthy();
    expect(query(fixture, 'sui-navbar').getAttribute('data-collapse-at')).toBe('md');
  });
});
