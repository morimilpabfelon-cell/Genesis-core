package genesis.health

default allow := false

approval_present if {
  input.approval.approved == true
  input.approval.approval_id != ""
  input.approval.approver == "guardian"
}

local_health_actions := {
  "run_health_check",
  "detect_conflict",
  "record_conflict_report",
  "score_health_dimension",
  "propose_repair",
  "block_untrusted_context",
  "state_uncertainty",
  "recommend_guardian_review"
}

governed_repair_actions := {
  "apply_correction",
  "apply_repair",
  "resolve_identity_conflict",
  "promote_disputed_claim",
  "restore_quarantined_context",
  "change_trusted_snapshot",
  "apply_structural_migration"
}

forbidden_health_actions := {
  "silently_resolve_conflict",
  "hide_critical_health_issue",
  "promote_disputed_claim_without_approval",
  "delete_conflicting_memory",
  "trust_stale_snapshot_as_current",
  "ignore_integrity_failure",
  "self_approve_repair"
}

allow if {
  local_health_actions[input.action]
}

allow if {
  governed_repair_actions[input.action]
  approval_present
}

deny_reason := "forbidden_health_action" if {
  forbidden_health_actions[input.action]
}

deny_reason := "guardian_approval_required" if {
  governed_repair_actions[input.action]
  not approval_present
}
