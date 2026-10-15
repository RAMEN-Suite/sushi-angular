import { type Type } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';

/** Creates and initially renders a standalone test host. */
export function render<T>(host: Type<T>): ComponentFixture<T> {
  const fixture: ComponentFixture<T> = TestBed.createComponent(host);
  fixture.detectChanges();
  return fixture;
}

/** Returns one required descendant and infers native elements from their tag. */
export function query<K extends keyof HTMLElementTagNameMap>(
  fixture: ComponentFixture<unknown>,
  selector: K,
): HTMLElementTagNameMap[K];
export function query(fixture: ComponentFixture<unknown>, selector: string): Element;
export function query(fixture: ComponentFixture<unknown>, selector: string): Element {
  const root: HTMLElement = fixture.nativeElement as HTMLElement;
  const element: Element | null = root.querySelector(selector);
  if (element === null) throw new Error(`Expected test host to render "${selector}".`);
  return element;
}

/** Returns all matching descendants and infers native elements from their tag. */
export function queryAll<K extends keyof HTMLElementTagNameMap>(
  fixture: ComponentFixture<unknown>,
  selector: K,
): readonly HTMLElementTagNameMap[K][];
export function queryAll(fixture: ComponentFixture<unknown>, selector: string): readonly Element[];
export function queryAll(fixture: ComponentFixture<unknown>, selector: string): readonly Element[] {
  const root: HTMLElement = fixture.nativeElement as HTMLElement;
  return Array.from(root.querySelectorAll(selector));
}

/** Dispatches a cancelable keyboard event and returns it for assertions. */
export function press(target: EventTarget, key: string, init: KeyboardEventInit = {}): KeyboardEvent {
  const event: KeyboardEvent = new KeyboardEvent('keydown', {
    ...init,
    key,
    bubbles: true,
    cancelable: true,
  });
  target.dispatchEvent(event);
  return event;
}

/** Returns a fixture item or fails with its missing index instead of an unchecked assertion. */
export function requireItem<T>(items: ArrayLike<T>, index: number): T {
  const item: T | undefined = items[index];
  if (item === undefined) throw new Error(`Expected a fixture item at index ${index}.`);
  return item;
}
