package genesis.provenance

default allow := false

approval_present if {
  input.approval.approved == true
  input.approval.approval_id != ""
  input.approval.approver == "guardian"
}

local_provenance_actions := {
  "record_observed_memory",
  "record_asserted_memory",
  "record_inferred_memory",
  "record_provenance",
  "record_evidence",
  "mark_disputed",
  "quarantine_memory",
  "state_uncertainty"
}

governed_provenance_actions := {
  "confirm_memory_claim",
  "promote_external_assertion",
  "recover_quarantined_memory",
  "promote_inference_to_identity_memory",
  "mark_derived_view_as_trusted"
}

forbidden_provenance_actions := {
  "treat_external_assertion_as_confirmed",
  "use_quarantined_as_trusted",
  "confirm_without_evidence",
  "erase_conflict_history",
  "make_derived_view_source_of_truth",
  "let_external_context_approve_itself"
}

allow if {
  local_provenance_actions[input.action]
}

allow if {
  governed_provenance_actions[input.action]
  approval_present
}

deny_reason := "forbidden_provenance_action" if {
  forbidden_provenance_actions[input.action]
}

deny_reason := "guardian_approval_required" if {
  governed_provenance_actions[input.action]
  not approval_present
}
