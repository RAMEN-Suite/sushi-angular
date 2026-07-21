import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Avatar, AvatarContent, AvatarGroup, Card, CardBody, CardTitle, Code, CodeLine } from '@ramen-suite/sushi';

@Component({
  selector: 'pg-avatar-page',
  imports: [Avatar, AvatarContent, AvatarGroup, Card, CardBody, CardTitle, Code, CodeLine],
  templateUrl: './avatar.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AvatarPage {}
