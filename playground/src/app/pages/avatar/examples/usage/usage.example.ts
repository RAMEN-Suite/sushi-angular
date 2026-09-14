import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Avatar, AvatarShape, AvatarSize } from '@sushi-kit/angular';

@Component({
  selector: 'pg-avatar-usage-example',
  imports: [Avatar],
  templateUrl: './usage.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AvatarUsageExample {
  protected readonly sizes: readonly AvatarSize[] = ['xs', 'sm', 'md', 'lg', 'xl'];
  protected readonly shapes: readonly AvatarShape[] = ['square', 'rounded', 'circle', 'squircle', 'hexagon'];
}
