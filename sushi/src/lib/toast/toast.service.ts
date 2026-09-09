import { DestroyRef, inject, Injectable, signal, Signal, WritableSignal } from '@angular/core';
import { ToastItem, ToastOptions } from './toast.interfaces';

interface ToastTimer {
  pauses: number;
  remaining: number;
  startedAt: number;
  timeout: ReturnType<typeof setTimeout> | null;
}

let nextToastId: number = 0;

@Injectable({ providedIn: 'root' })
/** Manages transient messages rendered by a Toast outlet. */
export class ToastService {
  /** @internal Current Toast queue in creation order. */
  public readonly toasts: Signal<readonly ToastItem[]>;

  private readonly toastState: WritableSignal<readonly ToastItem[]> = signal<readonly ToastItem[]>([]);
  private readonly timers: Map<string, ToastTimer> = new Map<string, ToastTimer>();
  private readonly destroyRef: DestroyRef = inject(DestroyRef);

  public constructor() {
    this.toasts = this.toastState.asReadonly();
    this.destroyRef.onDestroy((): void => this.clear());
  }

  /** Adds a Toast and returns its generated ID. */
  public show(options: ToastOptions): string {
    const item: ToastItem = {
      id: `sui-toast-${++nextToastId}`,
      message: options.message,
      title: options.title ?? null,
      severity: options.severity ?? null,
      variant: options.variant === undefined ? 'soft' : options.variant,
      duration: Math.max(0, options.duration ?? 5000),
      dismissible: options.dismissible ?? true,
      action: options.action ?? null,
      template: options.template ?? null,
    };
    this.toastState.update((items: readonly ToastItem[]): readonly ToastItem[] => [...items, item]);
    this.startTimer(item.id, item.duration);
    return item.id;
  }

  /** Removes one Toast from the queue. */
  public dismiss(id: string): void {
    this.clearTimer(id);
    this.toastState.update((items: readonly ToastItem[]): readonly ToastItem[] =>
      items.filter((item: ToastItem): boolean => item.id !== id),
    );
  }

  /** Removes every Toast and cancels pending timers. */
  public clear(): void {
    this.timers.forEach((_timer: ToastTimer, id: string): void => this.clearTimer(id));
    this.toastState.set([]);
  }

  /** @internal Pauses automatic dismissal while a Toast is being inspected. */
  public pause(id: string): void {
    const timer: ToastTimer | undefined = this.timers.get(id);
    if (!timer) return;
    timer.pauses += 1;
    if (timer.pauses > 1 || !timer.timeout) return;
    clearTimeout(timer.timeout);
    timer.timeout = null;
    timer.remaining = Math.max(0, timer.remaining - (Date.now() - timer.startedAt));
  }

  /** @internal Resumes automatic dismissal after interaction ends. */
  public resume(id: string): void {
    const timer: ToastTimer | undefined = this.timers.get(id);
    if (!timer || timer.pauses === 0) return;
    timer.pauses -= 1;
    if (timer.pauses > 0 || timer.timeout) return;
    if (timer.remaining <= 0) {
      this.dismiss(id);
      return;
    }
    this.schedule(id, timer);
  }

  private startTimer(id: string, duration: number): void {
    if (duration === 0) return;
    const timer: ToastTimer = { pauses: 0, remaining: duration, startedAt: Date.now(), timeout: null };
    this.timers.set(id, timer);
    this.schedule(id, timer);
  }

  private schedule(id: string, timer: ToastTimer): void {
    timer.startedAt = Date.now();
    timer.timeout = setTimeout((): void => this.dismiss(id), timer.remaining);
  }

  private clearTimer(id: string): void {
    const timer: ToastTimer | undefined = this.timers.get(id);
    if (timer?.timeout) clearTimeout(timer.timeout);
    this.timers.delete(id);
  }
}
