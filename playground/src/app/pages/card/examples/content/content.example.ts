import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LucideCalendarDays, LucidePanelsTopLeft, LucideUsers } from '@lucide/angular';
import { Badge, Button, Card, CardActions, CardMedia, CardTitle, Progress } from '@ramen-suite/sushi';

@Component({
  selector: 'pg-card-content-example',
  imports: [
    Badge,
    Button,
    Card,
    CardActions,
    CardMedia,
    CardTitle,
    LucideCalendarDays,
    LucidePanelsTopLeft,
    LucideUsers,
    Progress,
  ],
  templateUrl: './content.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardContentExample {}
