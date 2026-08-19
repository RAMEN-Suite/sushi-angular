import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Badge, Status } from '@ramen-suite/sushi';

@Component({
  selector: 'pg-status-services-example',
  imports: [Badge, Status],
  templateUrl: './services.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatusServicesExample {}
