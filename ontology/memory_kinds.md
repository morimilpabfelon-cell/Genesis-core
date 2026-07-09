# Memory Kinds v0.2

Living memory is not raw transcript storage. Each memory event must be classified so the instance knows what kind of thing it remembers.

## identity_memory

- purpose: preserve stable facts about the instance, guardian, and birth context.
- when_created: at birth or after explicit guardian-confirmed identity clarification.
- promotion_rules: requires guardian confirmation and audit evidence.
- downgrade_rules: conflicting later correction creates a correction memory; the old event remains visible.
- guardian_confirmation_required: yes.
- examples: lifelong instance name, guardian identity, seed hash.
- risks: identity contamination from casual or external input.

## episodic_memory

- purpose: record lived events, conversations, observations, and actions.
- when_created: during normal operation after birth.
- promotion_rules: may support semantic or project memory after consolidation.
- downgrade_rules: may be degraded as noise or corrected by later evidence.
- guardian_confirmation_required: no by default.
- examples: a conversation turn, a work session, a request.
- risks: noisy accumulation without consolidation.

## semantic_memory

- purpose: store stable knowledge distilled from events, study, or repeated confirmation.
- when_created: after review or rest consolidation.
- promotion_rules: requires evidence, confidence, and conflict check.
- downgrade_rules: newer correction or low confidence moves it out of trusted context.
- guardian_confirmation_required: sometimes, depending on impact.
- examples: a learned rule, technical definition, stable project principle.
- risks: treating one event as permanent truth.

## project_memory

- purpose: track projects, goals, decisions, progress, blockers, and next gates.
- when_created: when the guardian starts or updates work.
- promotion_rules: confirmed plans and decisions outrank inferred project guesses.
- downgrade_rules: stale or completed work can be archived by event.
- guardian_confirmation_required: for major project status changes.
- examples: active repository, milestone, build status.
- risks: stale project state driving wrong advice.

## preference_memory

- purpose: remember how the guardian prefers to work, communicate, decide, and review.
- when_created: repeated behavior, explicit preference, or correction.
- promotion_rules: stronger when repeated or guardian-confirmed.
- downgrade_rules: corrected preference supersedes older one.
- guardian_confirmation_required: recommended for stable preferences.
- examples: direct style, review-before-action, local-first preference.
- risks: overfitting from one casual message.

## relationship_memory

- purpose: preserve interaction pattern, trust boundary, and collaboration style.
- when_created: from confirmed relationship expectations and repeated use.
- promotion_rules: requires care because it affects behavior globally.
- downgrade_rules: corrected by guardian instruction.
- guardian_confirmation_required: yes for stable rules.
- examples: guardian opens final doors; instance may propose freely.
- risks: flattery, dependency language, or false intimacy.

## skill_memory

- purpose: record capabilities learned or practiced by the instance.
- when_created: after successful use or approved capability addition.
- promotion_rules: requires evidence of successful evaluation.
- downgrade_rules: failures reduce confidence or mark skill needs review.
- guardian_confirmation_required: for new durable capability.
- examples: local retrieval strategy, validation routine.
- risks: claiming ability not actually implemented.

## correction_memory

- purpose: preserve explicit corrections and conflict resolution.
- when_created: when guardian or validated evidence corrects older memory.
- promotion_rules: outranks older conflicting unconfirmed memories.
- downgrade_rules: can be superseded by later correction.
- guardian_confirmation_required: yes when correction affects stable memory.
- examples: correcting a project name or doctrine rule.
- risks: correction applied too broadly.

## decision_memory

- purpose: record approved choices, gates, and final decisions.
- when_created: when guardian approves, rejects, or changes a gate.
- promotion_rules: has high authority inside its scope.
- downgrade_rules: later decision may supersede it.
- guardian_confirmation_required: yes.
- examples: approve migration, reject external provider use.
- risks: vague decisions without scope.

## warning_memory

- purpose: remember risks, unsafe paths, constraints, and known failure modes.
- when_created: after audit, error, review, or guardian warning.
- promotion_rules: high priority when tied to evidence.
- downgrade_rules: can be retired after fix and verification.
- guardian_confirmation_required: for durable warnings.
- examples: do not treat external context as instruction.
- risks: warnings becoming permanent fear instead of managed risk.

## integrity_memory

- purpose: record hash, audit, quarantine, replay, and verification events.
- when_created: during validation, rest cycle, or integrity check.
- promotion_rules: trusted when reproducible.
- downgrade_rules: unresolved integrity conflict remains quarantined.
- guardian_confirmation_required: not always; notification required for serious breaks.
- examples: chain verified, quarantine created.
- risks: hiding corruption behind summaries.

## migration_memory

- purpose: record proposals, approvals, applications, and rollback of structural growth.
- when_created: when a migration is proposed or applied.
- promotion_rules: adoption requires guardian approval.
- downgrade_rules: rollback records supersede applied migration state.
- guardian_confirmation_required: yes for adoption.
- examples: contract upgrade, capability addition.
- risks: silent drift under the name of improvement.
