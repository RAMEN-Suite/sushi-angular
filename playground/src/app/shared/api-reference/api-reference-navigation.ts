const TARGET_HIGHLIGHT_CLASS: string = 'pg-api-target-highlight';

export function apiFragmentHref(document: Document, id: string): string {
  const browserWindow: Window | null = document.defaultView;
  return browserWindow ? `${browserWindow.location.pathname}${browserWindow.location.search}#${id}` : `#${id}`;
}

export function navigateToApiTarget(document: Document, event: MouseEvent, id: string): void {
  event.preventDefault();
  const target: HTMLElement | null = document.getElementById(id);
  if (!target) return;

  const browserWindow: Window | null = document.defaultView;
  if (browserWindow) {
    browserWindow.history.replaceState(null, '', apiFragmentHref(document, id));
  }

  target.classList.remove(TARGET_HIGHLIGHT_CLASS);
  void target.offsetWidth;
  target.classList.add(TARGET_HIGHLIGHT_CLASS);
  target.scrollIntoView({ behavior: 'smooth', block: 'center' });
  target.focus({ preventScroll: true });
}
