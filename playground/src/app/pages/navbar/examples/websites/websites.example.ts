import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LucideBell, LucideCircleQuestionMark, LucidePlus, LucideSearch, LucideSparkles } from '@lucide/angular';
import { Button, InputSurface, InputSurfaceControl, Kbd, Navbar, NavbarCenter, NavbarEnd, NavbarStart } from '@ramen-suite/sushi';

@Component({
  selector: 'pg-navbar-websites-example',
  imports: [
    Button,
    InputSurface,
    InputSurfaceControl,
    Kbd,
    LucideBell,
    LucideCircleQuestionMark,
    LucidePlus,
    LucideSearch,
    LucideSparkles,
    Navbar,
    NavbarCenter,
    NavbarEnd,
    NavbarStart,
  ],
  templateUrl: './websites.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarWebsitesExample {}
