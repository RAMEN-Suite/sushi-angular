import { Injectable, signal, WritableSignal } from '@angular/core';

let nextNavbarId: number = 0;

@Injectable()
export class NavbarState {
  public readonly contentId: string = `sui-navbar-content-${nextNavbarId++}`;
  public readonly expanded: WritableSignal<boolean> = signal(false);
  private toggleElement?: HTMLButtonElement;

  public close(): void {
    this.expanded.set(false);
  }

  public closeAndFocusToggle(): void {
    this.close();
    this.toggleElement?.focus();
  }

  public registerToggle(element: HTMLButtonElement): void {
    this.toggleElement = element;
  }

  public toggle(): void {
    this.expanded.update((expanded: boolean): boolean => !expanded);
  }
}
