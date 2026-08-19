import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Avatar, AvatarGroup } from '@ramen-suite/sushi';

@Component({
  selector: 'pg-avatar-profiles-example',
  imports: [Avatar, AvatarGroup],
  templateUrl: './profiles.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AvatarProfilesExample {}
