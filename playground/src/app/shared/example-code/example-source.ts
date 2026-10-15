export type ExampleSource = Readonly<{ css?: string; html: string; typescript: string }>;

export function textSource(module: unknown): string {
  if (typeof module !== 'object' || module === null || !('default' in module) || typeof module.default !== 'string') {
    throw new Error('Expected a text module with a default string export.');
  }
  return module.default;
}
