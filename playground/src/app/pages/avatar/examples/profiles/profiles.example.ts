import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Avatar, AvatarGroup, Card } from '@ramen-suite/sushi';

@Component({
  selector: 'pg-avatar-profiles-example',
  imports: [Avatar, AvatarGroup, Card],
  templateUrl: './profiles.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AvatarProfilesExample {}
