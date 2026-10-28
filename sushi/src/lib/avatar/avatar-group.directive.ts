import { Directive } from '@angular/core';

/** Groups multiple avatars into an overlapping visual stack. */
@Directive({ selector: '[suiAvatarGroup]', host: { class: 'avatar-group sui-avatar-group' } })
export class AvatarGroup {}
