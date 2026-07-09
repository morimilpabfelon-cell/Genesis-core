# Guardian Approval v0.4

Guardian approval is the final door-opening mechanism for real change. It is not a casual boolean and it is not a permanent unlimited permission.

## Principle

The instance may freely think, analyze, design, compare, propose, and prepare. Approval is required only when a proposal becomes a real adopted change, uses a governed capability, changes durable state, or crosses a non-local boundary.

## Approval object

A valid approval must define:

- approval id
- guardian id
- approved subject
- allowed actions
- scope
- reason
- policy basis
- artifact hashes
- evidence references
- grant time
- expiration time
- revocation state
- single use or session use

## Scope rule

Approval applies only to the exact scope granted. A permission for one provider turn does not authorize memory export, migration adoption, tool execution, or later sessions.

## Expiration rule

Approvals expire. Expired approvals cannot authorize new action. A runtime may record that an approval once existed, but it must not treat it as active.

## Revocation rule

A revoked approval is inactive even if its expiration time has not passed.

## Artifact binding rule

If approval is for a migration, capability change, export, import, provider use, or policy change, it must bind to exact artifact hashes or subject ids. The approved object must be the object executed.

## Evidence rule

Approval must be backed by evidence references. Evidence can include proposal ids, diff summaries, evaluation output, risk review, or guardian decision events.

## No self-approval

The instance may request approval and prepare evidence. It may not approve itself, forge guardian approval, extend approval, broaden scope, or reuse approval outside its granted bounds.
