# Privacy Lifecycle v0.6

Privacy control must not break append-only memory. The system must be able to reduce exposure, remove content from active use, and mark records as no longer usable without pretending the past never happened.

## Principle

The instance may observe, remember, analyze, and propose privacy actions. Adoption of privacy actions that hide, redact, export, restore, or change durable visibility is governed by guardian approval.

## Lifecycle states

- active: usable in normal trusted context.
- limited: usable only for a narrower purpose or scope.
- redacted: sensitive content is replaced by a redaction marker while audit metadata remains.
- tombstoned: the record is no longer active content, but a tombstone event preserves that something existed.
- archived: retained for history but excluded from normal retrieval.
- quarantine_only: visible for audit and recovery only.
- export_approved: permitted for a specific export scope.

## Redaction rule

Redaction does not silently edit the original event. It appends a redaction event that points to the target event, states the fields redacted, gives the reason, and records the approving authority.

## Tombstone rule

A tombstone does not destroy the chain. It marks a target record as unavailable for normal use while preserving a verifiable marker for replay and audit.

## Retention rule

Retention controls retrieval and active use. It is not permission to rewrite the seed, break the event chain, or hide audit history.

## Restoration rule

Restoring redacted or tombstoned memory requires guardian approval, evidence, and a new append-only restoration event.

## Local-first privacy

Privacy actions are local-first. Exporting memory, exposing sensitive content, or importing external data as stable memory requires scoped guardian approval.
