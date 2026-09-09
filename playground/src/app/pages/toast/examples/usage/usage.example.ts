import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Button, Toast, ToastService } from '@ramen-suite/sushi';

@Component({
  selector: 'pg-toast-usage-example',
  imports: [Button, Toast],
  providers: [ToastService],
  templateUrl: './usage.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToastUsageExample {
  private readonly toast: ToastService = inject(ToastService);

  protected showSaved(): void {
    this.toast.show({ message: 'Your changes were saved.', severity: 'success' });
  }

  protected showRetry(): void {
    this.toast.show({
      title: 'Connection interrupted',
      message: 'Check your connection and try again.',
      severity: 'warning',
      action: { label: 'Retry', run: (): void => this.showSaved() },
    });
  }

  protected showPersistent(): void {
    this.toast.show({ message: 'You are working offline.', duration: 0 });
  }
}
