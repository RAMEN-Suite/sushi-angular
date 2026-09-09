import { Component, inject } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { query, queryAll, render } from '../../../../testing/test-utils';
import { Toast } from '../toast.component';
import { ToastService } from '../toast.service';
import { ToastContentTemplate } from '../toast.templates';

@Component({
  imports: [Toast],
  template: `<sui-toast horizontal="start" vertical="top" [maxVisible]="2" />`,
})
class ToastHost {
  public readonly toast: ToastService = inject(ToastService);
}

@Component({
  imports: [Toast, ToastContentTemplate],
  template: `
    <sui-toast>
      <ng-template suiToastContent="custom" let-item let-dismiss="dismiss">
        <span class="custom-content">{{ item.message }}</span>
        <button type="button" class="custom-dismiss" (click)="dismiss()">Done</button>
      </ng-template>
      <ng-template suiToastContent="alternate" let-item>
        <strong class="alternate-content">{{ item.title }}</strong>
      </ng-template>
    </sui-toast>
  `,
})
class CustomToastHost {
  public readonly toast: ToastService = inject(ToastService);
}

afterEach((): void => {
  vi.useRealTimers();
});

describe('Toast', (): void => {
  it('renders recent messages with placement and live semantics', (): void => {
    const fixture: ComponentFixture<ToastHost> = render(ToastHost);
    fixture.componentInstance.toast.show({ message: 'First' });
    fixture.componentInstance.toast.show({ message: 'Second', severity: 'warning', title: 'Review' });
    fixture.componentInstance.toast.show({ message: 'Third', severity: 'success' });
    fixture.detectChanges();

    const outlet: Element = query(fixture, '.sui-toast');
    expect(outlet.classList).toContain('toast-start');
    expect(outlet.classList).toContain('toast-top');
    expect(queryAll(fixture, '.sui-toast__item')).toHaveLength(2);
    expect(queryAll(fixture, '.sui-toast__icon')).toHaveLength(2);
    expect(queryAll(fixture, '.sui-toast__item--with-actions')).toHaveLength(0);
    expect(query(fixture, '[role="alert"]').textContent).toContain('Second');
    expect(query(fixture, '[role="status"]').textContent).toContain('Third');
  });

  it('runs an action and dismisses its Toast by default', (): void => {
    const fixture: ComponentFixture<ToastHost> = render(ToastHost);
    const run: () => void = vi.fn();
    fixture.componentInstance.toast.show({
      message: 'Upload failed',
      severity: 'error',
      action: { label: 'Retry', run },
    });
    fixture.detectChanges();

    const action: HTMLButtonElement = query(fixture, '.sui-toast__actions button') as HTMLButtonElement;
    expect(query(fixture, '.sui-toast__item').classList).toContain('sui-toast__item--with-actions');
    expect(action.classList).toContain('btn-error');
    action.click();
    fixture.detectChanges();
    expect(run).toHaveBeenCalledOnce();
    expect(fixture.componentInstance.toast.toasts()).toHaveLength(0);
  });
});

describe('Toast templates', (): void => {
  it('renders custom content with a dismissal callback', (): void => {
    const fixture: ComponentFixture<CustomToastHost> = render(CustomToastHost);
    fixture.componentInstance.toast.show({ message: 'Custom feedback', template: 'custom' });
    fixture.componentInstance.toast.show({ message: 'Alternate feedback', title: 'Alternate', template: 'alternate' });
    fixture.componentInstance.toast.show({ message: 'Standard feedback' });
    fixture.detectChanges();

    expect(query(fixture, '.custom-content').textContent).toContain('Custom feedback');
    expect(query(fixture, '.alternate-content').textContent).toContain('Alternate');
    expect(query(fixture, '.sui-toast__content').textContent).toContain('Standard feedback');
    (query(fixture, '.custom-dismiss') as HTMLButtonElement).click();
    fixture.detectChanges();
    expect(fixture.componentInstance.toast.toasts()).toHaveLength(2);
  });
});

describe('Toast queue', (): void => {
  it('keeps a Toast when its action opts out of dismissal and clears the queue', (): void => {
    const fixture: ComponentFixture<ToastHost> = render(ToastHost);
    const run: () => void = vi.fn();
    fixture.componentInstance.toast.show({
      message: 'Connection lost',
      action: { label: 'Retry', run, dismiss: false },
    });
    fixture.componentInstance.toast.show({ message: 'Draft saved' });
    fixture.detectChanges();

    (query(fixture, '.sui-toast__actions button') as HTMLButtonElement).click();
    expect(run).toHaveBeenCalledOnce();
    expect(fixture.componentInstance.toast.toasts()).toHaveLength(2);

    fixture.componentInstance.toast.clear();
    fixture.detectChanges();
    expect(queryAll(fixture, '.sui-toast__item')).toHaveLength(0);
  });
});

describe('Toast dismissal', (): void => {
  it('dismisses a Toast through its built-in close action', (): void => {
    const fixture: ComponentFixture<ToastHost> = render(ToastHost);
    fixture.componentInstance.toast.show({ message: 'Dismiss me', duration: 0 });
    fixture.detectChanges();

    (query(fixture, '[aria-label="Dismiss Dismiss me"]') as HTMLButtonElement).click();
    fixture.detectChanges();
    expect(fixture.componentInstance.toast.toasts()).toHaveLength(0);
  });
});

describe('Toast timing', (): void => {
  it('pauses and resumes automatic dismissal', (): void => {
    vi.useFakeTimers();
    const fixture: ComponentFixture<ToastHost> = render(ToastHost);
    const id: string = fixture.componentInstance.toast.show({ message: 'Saved', duration: 1000 });

    vi.advanceTimersByTime(400);
    fixture.componentInstance.toast.pause(id);
    vi.advanceTimersByTime(1000);
    expect(fixture.componentInstance.toast.toasts()).toHaveLength(1);

    fixture.componentInstance.toast.resume(id);
    vi.advanceTimersByTime(600);
    expect(fixture.componentInstance.toast.toasts()).toHaveLength(0);
  });

  it('keeps duration-zero Toasts until explicitly dismissed', (): void => {
    vi.useFakeTimers();
    const fixture: ComponentFixture<ToastHost> = render(ToastHost);
    const id: string = fixture.componentInstance.toast.show({ message: 'Offline', duration: 0 });

    vi.runAllTimers();
    expect(fixture.componentInstance.toast.toasts()).toHaveLength(1);
    fixture.componentInstance.toast.dismiss(id);
    expect(fixture.componentInstance.toast.toasts()).toHaveLength(0);
  });
});
