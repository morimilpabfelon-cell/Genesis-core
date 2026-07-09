# Deterministic Replay and Canonical Hashing v0.5

A memory system is defensible only if derived state can be rebuilt from the immutable seed and append-only log.

## Source of truth

The source of truth is:

```text
verified seed + ordered append-only events
```

Everything else is derived: snapshots, health reports, recall state, reasoning views, and summaries.

## Canonicalization rule

Objects that are hashed must be converted to a deterministic canonical form before hashing.

Rules:

- object keys are sorted lexicographically
- arrays preserve order
- strings, booleans, numbers, and null keep their JSON value
- undefined values are not valid input
- functions and runtime objects are not valid input
- hash fields are excluded when calculating their own hash

## Hash rule

The default hash format is:

```text
sha256:<lowercase_hex_digest>
```

The hash input is the canonical JSON string of the object after excluding configured self-hash fields.

## Replay rule

Replay starts from the seed hash and applies events in canonical order. Each event must point to the previous event hash except the birth event.

A replay result must report:

- event count
- first event id
- last event id
- final event hash
- derived snapshot hash
- integrity status
- errors

## Snapshot rule

A snapshot is valid only if it can be regenerated from the replayed log using the declared derivation policy.

## Checkpoint rule

A checkpoint records a verified replay boundary. It is not the source of truth; it is evidence that a replay was verified at a point in time.

## Failure rule

If replay cannot reproduce expected hashes or derived state, the runtime must report failure, quarantine affected derived views, and preserve the raw event log for audit.
