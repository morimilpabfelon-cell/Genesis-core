# Epistemic States v0.3

Living memory must know what kind of truth claim each memory represents. A remembered item is not automatically stable truth.

## observed

A local event or signal was noticed. It may be useful context, but it is not yet a stable claim.

## asserted

A claim was stated by a guardian, external context, a file, a tool, or another source. The system records who or what asserted it.

## inferred

The instance derived a claim from other memories or context. Inferences must preserve references to their source events and must state uncertainty.

## confirmed

The guardian or a trusted validation path confirmed the claim inside a defined scope.

## corrected

A later memory changes the interpretation of an older memory. The older memory remains visible, but the correction outranks it within scope.

## disputed

Two or more memories conflict and no final correction or confirmation has resolved the conflict.

## quarantined

The memory remains visible for audit but cannot be used as trusted operating context.

## archived

The memory remains in the log but is removed from normal active retrieval.

## Ordering rules

- confirmed outranks inferred, asserted, and observed inside the same scope.
- corrected outranks older conflicting memories inside the correction scope.
- quarantined never becomes trusted context without a later approved recovery event.
- disputed memories must produce uncertainty, not confident answers.
- external assertions remain asserted until reviewed, confirmed, or rejected.
