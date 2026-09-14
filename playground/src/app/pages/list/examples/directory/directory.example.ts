import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Avatar, Button, Card, List, ListItemTemplate } from '@sushi-kit/angular';
import { LucideEllipsis, LucideMail } from '@lucide/angular';

interface Member {
  readonly name: string;
  readonly role: string;
  readonly location: string;
  readonly initials: string;
  readonly image: boolean;
}

@Component({
  selector: 'pg-list-directory-example',
  imports: [Avatar, Button, Card, List, ListItemTemplate, LucideEllipsis, LucideMail],
  templateUrl: './directory.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListDirectoryExample {
  protected readonly members: readonly Member[] = [
    { name: 'Ada Lovelace', role: 'Lead engineer', location: 'Berlin', initials: 'AL', image: true },
    { name: 'Grace Hopper', role: 'Platform architect', location: 'New York', initials: 'GH', image: false },
  ];
}
