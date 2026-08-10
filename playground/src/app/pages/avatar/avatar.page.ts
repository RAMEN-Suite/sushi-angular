import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Avatar, AvatarGroup, Card, CardTitle, Code, CodeLine } from '@ramen-suite/sushi';

@Component({
  selector: 'pg-avatar-page',
  imports: [Avatar, AvatarGroup, Card, CardTitle, Code, CodeLine],
  templateUrl: './avatar.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AvatarPage {}
