import { Directive, ElementRef, inject } from '@angular/core';

/**
 * Adapts Navbar disclosures to mobile and desktop layouts.
 * @internal
 */
@Directive({
  selector: 'details[suiNavbarDropdown]',
  host: {
    class: 'sui-navbar__dropdown group',
    '(click)': 'handleClick($event)',
    '(focusout)': 'handleFocusOut($event)',
    '(keydown.escape)': 'handleEscape($event)',
    '(toggle)': 'handleToggle()',
  },
})
export class NavbarDropdown {
  private readonly element: HTMLDetailsElement = inject<ElementRef<HTMLDetailsElement>>(ElementRef).nativeElement;

  protected handleClick(event: Event): void {
    if (event.target instanceof Element && event.target.closest('summary[aria-disabled="true"]')) {
      event.preventDefault();
      return;
    }

    if (event.target instanceof Element && event.target.closest('a')) {
      this.close();
    }
  }

  protected handleFocusOut(event: FocusEvent): void {
    if (event.relatedTarget instanceof Node && this.element.contains(event.relatedTarget)) {
      return;
    }

    this.close();
  }

  protected handleEscape(event: Event): void {
    if (!this.element.open) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    this.close();
    this.element.querySelector<HTMLElement>(':scope > summary')?.focus();
  }

  protected handleToggle(): void {
    if (!this.element.open) {
      return;
    }

    const navbar: HTMLElement | null = this.element.closest<HTMLElement>('.sui-navbar');
    navbar
      ?.querySelectorAll<HTMLDetailsElement>('details[suiNavbarDropdown][open]')
      .forEach((dropdown: HTMLDetailsElement): void => {
        if (dropdown !== this.element) {
          dropdown.removeAttribute('open');
        }
      });
  }

  private close(): void {
    this.element.removeAttribute('open');
  }
}
