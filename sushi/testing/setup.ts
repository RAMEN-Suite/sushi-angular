class ResizeObserverStub implements ResizeObserver {
  private readonly targets: Set<Element> = new Set<Element>();

  public disconnect(): void {
    this.targets.clear();
  }

  public observe(target: Element, _options?: ResizeObserverOptions): void {
    this.targets.add(target);
  }

  public unobserve(target: Element): void {
    this.targets.delete(target);
  }
}

globalThis.ResizeObserver = ResizeObserverStub;
