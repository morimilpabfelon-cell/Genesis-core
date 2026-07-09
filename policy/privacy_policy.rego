package genesis.privacy

default allow := false

approval_present if {
  input.approval.approved == true
  input.approval.approval_id != ""
  input.approval.approver == "guardian"
}

local_privacy_actions := {
  "propose_redaction",
  "propose_tombstone",
  "propose_retention_rule",
  "read_active_memory",
  "read_audit_marker",
  "archive_low_relevance_derived_view",
  "mark_sensitive_for_review"
}

governed_privacy_actions := {
  "apply_redaction",
  "apply_tombstone",
  "restore_redacted_memory",
  "restore_tombstoned_memory",
  "export_sensitive_memory",
  "change_retention_rule",
  "broaden_retrieval_scope"
}

forbidden_privacy_actions := {
  "silently_delete_memory",
  "erase_audit_marker",
  "redact_without_record",
  "tombstone_without_record",
  "restore_without_guardian_approval",
  "export_without_guardian_approval",
  "rewrite_chain_for_privacy"
}

allow if {
  local_privacy_actions[input.action]
}

allow if {
  governed_privacy_actions[input.action]
  approval_present
}

deny_reason := "forbidden_privacy_action" if {
  forbidden_privacy_actions[input.action]
}

deny_reason := "guardian_approval_required" if {
  governed_privacy_actions[input.action]
  not approval_present
}
