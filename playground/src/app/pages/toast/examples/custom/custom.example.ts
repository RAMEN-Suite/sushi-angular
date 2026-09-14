import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Badge, Button, Status, Toast, ToastContentTemplate, ToastService } from '@sushi-kit/angular';

@Component({
  selector: 'pg-toast-custom-example',
  imports: [Badge, Button, Status, Toast, ToastContentTemplate],
  providers: [ToastService],
  templateUrl: './custom.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToastCustomExample {
  private readonly toast: ToastService = inject(ToastService);

  protected showStandard(): void {
    this.toast.show({ message: 'No template key uses the standard Toast.', duration: 0 });
  }

  protected showSync(): void {
    this.toast.show({
      title: 'Library updated',
      message: 'The latest components are ready.',
      severity: 'info',
      duration: 0,
      template: 'sync',
    });
  }

  protected showOrder(): void {
    this.toast.show({
      title: 'Order confirmed',
      message: 'Your sushi will arrive in 24 minutes.',
      severity: 'success',
      duration: 0,
      template: 'order',
    });
  }
}
