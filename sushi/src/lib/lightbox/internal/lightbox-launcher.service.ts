import { ApplicationRef, ComponentRef, createComponent, DOCUMENT, EnvironmentInjector, inject, Injectable } from '@angular/core';
import { GalleryImage } from '../../gallery';
import { Lightbox } from '../lightbox.component';

interface LightboxLaunchOptions {
  readonly zoom: boolean;
  readonly wheelToZoom: boolean;
  readonly ariaLabel: string;
  readonly description: string | null;
}

/** @internal */
@Injectable({ providedIn: 'root' })
export class LightboxLauncher {
  private readonly applicationRef: ApplicationRef = inject(ApplicationRef);
  private readonly environmentInjector: EnvironmentInjector = inject(EnvironmentInjector);
  private readonly document: Document = inject(DOCUMENT);
  private activeRef: ComponentRef<Lightbox> | null = null;

  public show(image: GalleryImage, options: LightboxLaunchOptions): void {
    this.destroyActive();
    const componentRef: ComponentRef<Lightbox> = createComponent(Lightbox, {
      environmentInjector: this.environmentInjector,
    });
    this.activeRef = componentRef;
    componentRef.setInput('image', image);
    componentRef.setInput('zoom', options.zoom);
    componentRef.setInput('wheelToZoom', options.wheelToZoom);
    componentRef.setInput('ariaLabel', options.ariaLabel);
    componentRef.setInput('description', options.description);
    this.applicationRef.attachView(componentRef.hostView);
    this.document.body.append(componentRef.location.nativeElement as HTMLElement);
    componentRef.changeDetectorRef.detectChanges();
    componentRef.instance.open.subscribe((open: boolean): void => {
      if (!open) queueMicrotask((): void => this.destroy(componentRef));
    });
    componentRef.instance.show();
    componentRef.changeDetectorRef.detectChanges();
  }

  private destroy(componentRef: ComponentRef<Lightbox>): void {
    if (this.activeRef !== componentRef) return;
    this.applicationRef.detachView(componentRef.hostView);
    (componentRef.location.nativeElement as HTMLElement).remove();
    componentRef.destroy();
    this.activeRef = null;
  }

  private destroyActive(): void {
    if (this.activeRef) this.destroy(this.activeRef);
  }
}
