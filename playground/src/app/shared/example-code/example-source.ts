export type ExampleSource = Readonly<{ css?: string; html: string; typescript: string }>;

export const textSource: (module: unknown) => string = (module: unknown): string => (module as { default: string }).default;
