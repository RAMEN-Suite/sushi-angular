import { saveGeneratedApi } from './api-reference/generated-file';
import { generateApiReference } from './api-reference/generator';
import type { ApiReferenceGeneration } from './api-reference/generator';

const generation: ApiReferenceGeneration = generateApiReference();

saveGeneratedApi(generation.data, generation.paths).catch((error: unknown): never => {
  throw error;
});
