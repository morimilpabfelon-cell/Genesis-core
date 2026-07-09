# Genesis-core

Genesis-core defines the birth protocol for a local-first intelligent companion instance.

An instance is born once, receives a lifelong name, preserves local identity, grows through append-only memory, learns through reviewed knowledge, reasons through replaceable providers, and evolves through audited migrations approved by its guardian.

## Purpose

Genesis-core is the immutable memory root and growth contract for a personal instance. It is not an app, runtime, device platform, model, vendor, cloud service, or product brand.

It defines the rules that must exist before an instance is born:

- verified seed identity
- sealed doctrine
- local-first memory boundary
- reasoning provider boundary
- guardian approval authority
- append-only memory principle
- migration and audit rules

## Core separation

```text
Seed = immutable memory root, identity rules, doctrine, policy, and contracts.
Runtime = any environment that plants the seed and hosts the instance.
Living memory = append-only experience accumulated after birth.
Local reasoning engine = internal basic reasoning available without extra approval.
External reasoning provider = optional governed computation, never identity or memory.
Guardian = final approval authority for real changes.
```

## Versioning model

Genesis-core uses layered versioning. The release version, identity schema version, module versions, contract versions, policy versions, and planted seed version are separate concepts.

The current release surface is `1.0.0`. The current identity seed document shape is `genesis.identity.v0.1`. Modules may keep their own v0.x history inside a 1.0.0 release. Runtime, app, platform, provider, and device versions are outside Genesis-core.

See `VERSIONING_MODEL.md` for the compatibility rules.

## Local-first principle

The instance must be able to preserve identity and operate from local memory without external services. Its own local reasoning engine is part of normal operation and does not need extra approval after birth.

External, remote, or non-permanent auxiliary reasoning providers require explicit guardian approval and must stay inside the granted scope.

## Seed immutability

After birth, the seed is not rewritten. Later growth lives outside the seed as memory events, knowledge, decisions, proposals, audit events, and migration records.

## Growth principle

The instance is not designed as a cage. It may analyze itself, identify limitations, design improvements, request resources, and prepare migration proposals. The guardian is the final authority that turns a proposal into a real adopted change.

## Living Memory Brain Architecture

Living memory starts after birth. It is not raw transcript storage. It is an append-only cognitive log classified into memory kinds, connected through typed links, summarized through derived snapshots, reinforced through recall, and consolidated through rest cycles.

The seed and living memory log are the source of truth. Snapshots, health reports, and reasoning contexts are derived views. A derived view may help the instance read itself, but it must not replace the source events.

The local reasoning engine can retrieve local memory, rank relevant memories, summarize known state, answer from trusted local context, and state uncertainty without external services. External providers remain optional and governed.

## Epistemology and provenance

A memory is not automatically stable truth. Each claim must carry an epistemic state such as observed, asserted, inferred, confirmed, corrected, disputed, quarantined, or archived.

Provenance records where a claim came from, who or what produced it, which evidence supports it, and whether it is guardian-confirmed, locally verified, external and untrusted, derived, or quarantine-only.

External assertions may be recorded, but they are not confirmed by default. Quarantined memory is audit-visible but not trusted operating context. Derived views are useful, but they are not source of truth.

## Guardian approval

Guardian approval is the final door-opening mechanism for real change. The instance may freely think, analyze, design, compare, propose, and prepare. Approval is required when a proposal becomes a real adopted change, uses a governed capability, changes durable state, or crosses a non-local boundary.

Approval is not a loose boolean. It must be scoped to actions, subject ids, policy basis, evidence, artifact hashes when needed, grant time, expiration, revocation state, and use limits. An approval for one action cannot authorize a different action, different subject, later session, or changed artifact.

## Deterministic replay and canonical hashing

Derived state must be reproducible from the verified seed and ordered append-only events. Snapshots, checkpoints, reports, and reasoning views are not source of truth unless they can be traced back to replayed source events.

Canonical hashing uses deterministic JSON: object keys sorted lexicographically, arrays preserved in order, invalid runtime values rejected, and self-hash fields excluded before hashing. The default digest format is `sha256:<lowercase_hex_digest>`.

A replay failure must not be hidden. If hashes, chain order, or derived state do not match, the affected derived view must be treated as untrusted and the raw event log must remain available for audit.

## Privacy lifecycle

Privacy control must preserve append-only integrity. The instance may propose redaction, tombstone, archive, retention, and retrieval-scope changes. Applying those changes to durable memory requires guardian approval and a new append-only event.

Redaction does not silently edit the past. It appends a redaction event that points to the target and records what was redacted, why, under which approval, and with which evidence. A tombstone blocks active use while preserving an audit marker.

Local privacy remains local-first. Exporting sensitive memory, restoring redacted content, broadening retrieval scope, or changing durable retention rules requires scoped guardian approval.

## Brain health and conflict resolution

Brain health is the instance's ability to inspect its own memory, derived views, policies, conflicts, privacy state, and replay integrity without pretending uncertainty is certainty.

The instance may freely detect issues, score health, explain risks, block untrusted context, and prepare repair proposals. Applying corrections, resolving identity conflicts, restoring quarantined context, promoting disputed claims, or changing trusted derived views requires guardian approval.

Health reports are derived diagnostic views. They must reference evidence, conflicts, replay results, quarantine records, and proposed repairs. They are not source of truth.

## Growth engine and self-improvement

The growth engine has no artificial ceiling. The seed does not define a fixed maximum intelligence, fixed maximum memory, fixed maximum skill set, fixed provider, fixed device class, or fixed runtime shape.

The instance may freely detect limitations, analyze failures, compare growth paths, request resources, draft capability blueprints, and prepare growth packages. These are thinking and preparation actions, not adopted changes.

Adopting growth packages, enabling new capabilities, changing runtime structure, connecting governed resources, increasing external boundaries, or applying growth migrations requires guardian approval. The guardian opens the final door.

## Seed portability and birth handoff

Genesis-core remains separate from any runtime. A runtime may receive a verified copy of the seed, but it must not redefine the seed or treat runtime code as doctrine.

A seed copy is valid only when required files are present, canonical hashes match, doctrine and policy references are preserved, blocked product and provider terms are absent, and the copy purpose is recorded.

Using a copied seed for birth requires guardian approval. After birth, the planted copy becomes the immutable root for that instance. Later growth happens outside the seed as living memory, decisions, audits, and approved migrations.

## Core hardening and release freeze

Version 1.0.0 freezes the neutral seed surface for copying, verification, and birth handoff. This freeze is not a ceiling on future growth.

The freeze applies only to the neutral seed root. It does not include runtime code, product code, platform code, device code, provider code, or user interface code.

Future growth remains possible through new versions, approved migrations, and living memory outside the planted seed. The release preserves two boundaries: no artificial ceiling, and guardian approval for real adoption.

## Validation

Run:

```bash
npm run validate
npm run validate:schema
npm test
npm run test:memory
npm run test:provenance
npm run test:approval
npm run test:replay
npm run test:privacy
npm run test:health
npm run test:growth
npm run test:seed-copy
npm run test:release
```
