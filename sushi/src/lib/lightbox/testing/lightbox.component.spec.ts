import { Component, DebugElement, signal, WritableSignal } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import type PhotoSwipe from 'photoswipe';
import type { PhotoSwipeOptions } from 'photoswipe';
import { describe, expect, it, vi } from 'vitest';
import { render } from '../../../../testing/test-utils';
import { GalleryImage } from '../../gallery';
import { LIGHTBOX_LOADER, LightboxLoader } from '../internal/lightbox-loader.token';
import { LightboxLauncher } from '../internal/lightbox-launcher.service';
import { LightboxTrigger } from '../lightbox-trigger.directive';
import { Lightbox } from '../lightbox.component';

type ViewerEvent = 'afterInit' | 'change' | 'close' | 'destroy' | 'uiRegister';

class PhotoSwipeStub {
  public static latest: PhotoSwipeStub | null = null;

  public readonly element: HTMLElement = document.createElement('div');
  public readonly ui: { readonly registerElement: ReturnType<typeof vi.fn> } = { registerElement: vi.fn() };
  public readonly options: PhotoSwipeOptions;
  public currIndex: number;
  public currSlide: undefined;
  private readonly handlers: Map<ViewerEvent, () => void> = new Map<ViewerEvent, () => void>();

  public constructor(options: PhotoSwipeOptions) {
    this.options = options;
    this.currIndex = options.index ?? 0;
    PhotoSwipeStub.latest = this;
  }

  public on(event: ViewerEvent, handler: () => void): void {
    this.handlers.set(event, handler);
  }

  public init(): void {
    this.handlers.get('afterInit')?.();
    this.handlers.get('uiRegister')?.();
  }

  public goTo(index: number): void {
    this.currIndex = index;
    this.handlers.get('change')?.();
  }

  public close(): void {
    this.handlers.get('close')?.();
  }

  public destroy(): void {
    this.handlers.get('destroy')?.();
  }
}

const loadViewer: LightboxLoader = (): Promise<typeof PhotoSwipe> =>
  Promise.resolve(PhotoSwipeStub as unknown as typeof PhotoSwipe);

@Component({
  imports: [Lightbox],
  providers: [{ provide: LIGHTBOX_LOADER, useValue: loadViewer }],
  template: `
    <button type="button">Open viewer</button>
    <sui-lightbox [image]="images[0]" [images]="images" [(activeIndex)]="activeIndex" [(open)]="open" />
  `,
})
class Host {
  public readonly activeIndex: WritableSignal<number> = signal(1);
  public readonly open: WritableSignal<boolean> = signal(false);
  public readonly images: readonly GalleryImage[] = [
    { value: 'a', src: 'a.jpg', width: 800, height: 600, alt: 'A' },
    { value: 'b', src: 'b.jpg', width: 800, height: 600, alt: 'B' },
  ];
}

class LauncherStub {
  public readonly show: ReturnType<typeof vi.fn> = vi.fn();
}

@Component({
  imports: [LightboxTrigger],
  providers: [{ provide: LightboxLauncher, useClass: LauncherStub }],
  template: `<img suiLightbox src="menu.jpg" width="640" height="480" alt="Seasonal menu" />`,
})
class TriggerHost {}

describe('Lightbox', (): void => {
  it('opens a collection at its active image with navigation controls', async (): Promise<void> => {
    const fixture: ComponentFixture<Host> = render(Host);
    const instance: Lightbox = fixture.debugElement.query(By.directive(Lightbox)).componentInstance as Lightbox;
    instance.show();
    fixture.detectChanges();
    await fixture.whenStable();

    const viewer: PhotoSwipeStub | null = PhotoSwipeStub.latest;
    if (!viewer) throw new Error('Expected the Lightbox viewer to be created.');
    expect(fixture.componentInstance.open()).toBe(true);
    expect(viewer.options.index).toBe(1);
    expect(viewer.options.arrowPrev).toBe(true);
    expect(viewer.options.arrowNext).toBe(true);
    expect(viewer.options.counter).toBe(true);
    expect(viewer.options.dataSource).toHaveLength(2);
    expect(viewer.element.getAttribute('aria-label')).toBe('Image viewer');

    viewer.goTo(0);
    expect(fixture.componentInstance.activeIndex()).toBe(0);
  });

  it('closes through its two-way visibility contract', async (): Promise<void> => {
    const fixture: ComponentFixture<Host> = render(Host);
    const instance: Lightbox = fixture.debugElement.query(By.directive(Lightbox)).componentInstance as Lightbox;
    instance.show();
    fixture.detectChanges();
    await fixture.whenStable();

    instance.close();
    expect(fixture.componentInstance.open()).toBe(false);
  });
});

describe('Lightbox focus management', (): void => {
  it('restores focus after the viewer is destroyed', async (): Promise<void> => {
    const fixture: ComponentFixture<Host> = render(Host);
    const trigger: HTMLButtonElement = fixture.debugElement.query(By.css('button')).nativeElement as HTMLButtonElement;
    const instance: Lightbox = fixture.debugElement.query(By.directive(Lightbox)).componentInstance as Lightbox;
    trigger.focus();

    instance.show();
    fixture.detectChanges();
    await fixture.whenStable();

    const viewer: PhotoSwipeStub | null = PhotoSwipeStub.latest;
    if (!viewer) throw new Error('Expected the Lightbox viewer to be created.');
    viewer.destroy();

    expect(trigger).toBe(document.activeElement);
  });
});

describe('Lightbox trigger', (): void => {
  it('opens its native image with stable dimensions and accessible metadata', (): void => {
    const fixture: ComponentFixture<TriggerHost> = render(TriggerHost);
    const trigger: DebugElement = fixture.debugElement.query(By.directive(LightboxTrigger));
    const launcher: LauncherStub = trigger.injector.get(LightboxLauncher) as unknown as LauncherStub;

    trigger.injector.get(LightboxTrigger).show();

    const [source, options] = launcher.show.mock.calls[0] as [
      GalleryImage,
      { ariaLabel: string; zoom: boolean; wheelToZoom: boolean },
    ];
    expect(source.src).toContain('menu.jpg');
    expect(source).toMatchObject({ width: 640, height: 480, alt: 'Seasonal menu' });
    expect(options).toMatchObject({ ariaLabel: 'Image viewer', zoom: true, wheelToZoom: false });
  });

  it('opens with Space without allowing the page to scroll', (): void => {
    const fixture: ComponentFixture<TriggerHost> = render(TriggerHost);
    const trigger: DebugElement = fixture.debugElement.query(By.directive(LightboxTrigger));
    const image: HTMLImageElement = trigger.nativeElement as HTMLImageElement;
    const launcher: LauncherStub = trigger.injector.get(LightboxLauncher) as unknown as LauncherStub;

    const event: KeyboardEvent = new KeyboardEvent('keydown', { key: ' ', bubbles: true, cancelable: true });
    image.dispatchEvent(event);

    expect(event.defaultPrevented).toBe(true);
    expect(launcher.show).toHaveBeenCalledOnce();
  });
});
