# Genesis-core Versioning Model

Genesis-core uses layered versioning. A release version is not the same thing as a seed identity schema version or a module version.

## Version layers

| Layer | Meaning | Current value |
| --- | --- | --- |
| release_version | Version of the repository surface intended for verification, copy, and release freeze. | 1.0.0 |
| identity_schema_version | Version of the identity seed document shape. | genesis.identity.v0.2 |
| module_version | Version of a specific constitutional module such as living memory, provenance, approval, replay, privacy, health, growth, seed copy, or release. | v0.x per module |
| contract_version | Version implied by a contract schema file and its required fields. | file-local |
| policy_version | Version implied by a policy file and its action sets. | file-local |
| planted_seed_version | Version of the verified seed copy used at birth by a runtime outside this repository. | recorded at birth handoff |

## Rules

1. A release may include modules with different module versions.
2. A module version change does not automatically change the identity schema version.
3. The identity schema version changes only when the identity seed document shape changes.
4. The release version changes when the verified repository surface changes.
5. A planted seed copy must record the release version and seed identity schema version it was created from.
6. Runtime, app, platform, provider, and device versions are outside Genesis-core.
7. Future growth is not blocked by a release freeze. Growth occurs through new releases, approved migrations, or living memory after birth.
8. Guardian approval remains the final authority for adopting real changes.
9. Identity release references declare which neutral modules belong to the release surface; they must not reference runtime, app, platform, provider, device, or product code.

## Compatibility rule

The current release is compatible when:

- release_version is 1.0.0
- identity_schema_version is genesis.identity.v0.2
- identity release references point only to neutral Genesis-core files
- local reasoning remains available without external provider approval
- external providers remain governed
- runtime remains separate from seed
- no artificial growth ceiling is introduced
