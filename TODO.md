# Release preparation

The component library, tests, and playground are the current project scope. The DevOps owner will define and implement the release process before the first npm publication.

- Confirm ownership and publish access for the public npm scope `@sushi-kit`.
- Choose the initial version, npm dist-tag, versioning policy, and changelog process.
- Pin supported Node.js and npm versions for the release environment; the repository currently uses `.nvmrc` and the `packageManager` field.
- Define the CI gates. The repository handoff command is `npm run verify`.
- Build from a clean checkout and test the packed artifact in a new Angular application, including `@sushi-kit/angular/styles.css`.
- Generate and validate third-party license notices from the release dependency graph.
- Configure trusted npm publication for `@sushi-kit/angular`, including public access, authentication, provenance, and protected release permissions.
- Publish from a commit that passed all gates, create the matching Git tag/release, and retain the package integrity output.
- Install the published version from npm and verify one component, one overlay, the global stylesheet, and the generated type declarations.
- Decide how and where the playground documentation is deployed; keep that deployment separate from package publication.
