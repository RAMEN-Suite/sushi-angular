import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LucideCopy, LucideMail, LucideMessageCircle, LucideShare2 } from '@lucide/angular';
import { Button, Input, InputGroup, JoinItem, Popover, PopoverTrigger } from '@ramen-suite/sushi';

@Component({
  selector: 'pg-popover-usage-example',
  imports: [
    Button,
    Input,
    InputGroup,
    JoinItem,
    LucideCopy,
    LucideMail,
    LucideMessageCircle,
    LucideShare2,
    Popover,
    PopoverTrigger,
  ],
  templateUrl: './usage.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PopoverUsageExample {}
