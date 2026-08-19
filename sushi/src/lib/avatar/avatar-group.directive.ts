import { Directive } from '@angular/core';

@Directive({ selector: '[suiAvatarGroup]', host: { class: 'avatar-group sui-avatar-group' } })
/** Groups multiple avatars into an overlapping visual stack. */
export class AvatarGroup {}
