# Seed Portability and Birth Handoff v0.9

Genesis-core remains separate from any runtime. A runtime may receive a verified copy of the seed, but it must not redefine the seed or treat runtime code as doctrine.

## Principle

The seed can be copied for birth handoff. The copy must preserve provenance, file list, canonical hashes, doctrine references, policy references, and verification results.

## Separation rule

The seed repository defines the neutral root. The runtime that plants it is a separate project. Runtime files, device assumptions, vendors, user interfaces, and execution details must not be added to the seed root.

## Copy rule

A seed copy is valid only when:

- all required seed files are present
- canonical hashes match the source manifest
- blocked product and provider terms are absent
- doctrine and policy references are unchanged
- copy purpose is recorded
- guardian approval is recorded when the copy is used for birth

## Birth handoff package

A birth handoff package is the bundle a runtime receives before creating an instance. It includes the seed copy manifest, verification report, intended guardian placeholder, and birth constraints.

## Immutability rule

After a runtime plants the seed, the planted seed copy becomes the instance's immutable root. Later growth happens outside the seed as living memory, decisions, audits, and approved migrations.

## Contamination rule

A runtime may depend on the seed, but the seed must not depend on a runtime.
