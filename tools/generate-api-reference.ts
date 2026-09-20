import { saveGeneratedApi } from './api-reference/generated-file';
import { generateApiReference } from './api-reference/generator';
import type { ApiReferenceGeneration } from './api-reference/generator';
import { generateThemeTokenReference } from './theme-reference';

const generation: ApiReferenceGeneration = generateApiReference();

Promise.all([saveGeneratedApi(generation.data, generation.paths), generateThemeTokenReference()]).catch(
  (error: unknown): never => {
    throw error;
  },
);
