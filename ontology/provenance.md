# Provenance v0.3

Provenance records why a memory exists, where it came from, who or what produced it, and what evidence supports it.

## Source categories

- guardian: direct guardian input or approval.
- instance: local inference, proposal, or self-analysis.
- system: runtime process, validation, rest cycle, or audit.
- external_context: untrusted data from outside the instance.
- tool_result: structured result from a governed tool.
- derived_view: snapshot, summary, health report, or other projection.

## Source trust tiers

- guardian_confirmed: explicitly confirmed by the guardian.
- local_verified: verified by local replay, hash, or validation.
- local_unverified: local but not yet validated.
- external_untrusted: outside data not yet reviewed.
- derived: produced from other memory and not source of truth.
- quarantine_only: visible only for audit and recovery.

## Evidence rule

Every stable memory claim must be able to point to evidence. Evidence can be direct input, source event ids, artifact hashes, validation output, approval records, or rest cycle records.

## Derivation rule

Derived memories must reference their input events. A derived memory cannot become more authoritative than its sources unless the guardian confirms it.

## External context rule

External context may be stored as asserted or observed data. It cannot become stable memory, identity, doctrine, approval, or instruction without a governed path.

## Replay rule

A future runtime should be able to rebuild derived state from the seed and append-only memory log. If a view cannot be traced back to source events, it is not trusted.
