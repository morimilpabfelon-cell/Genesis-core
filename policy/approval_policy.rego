package genesis.approval

default allow := false

approval_complete if {
  input.approval.approval_id != ""
  input.approval.guardian_id != ""
  input.approval.subject_id != ""
  count(input.approval.allowed_actions) > 0
  count(input.approval.evidence_refs) > 0
  input.approval.revoked == false
  input.approval.used_count < input.approval.use_limit
}

action_in_scope if {
  input.approval.allowed_actions[_] == input.action
}

subject_matches if {
  input.approval.subject_id == input.subject_id
}

artifact_bound if {
  input.requires_artifact_hash == false
}

artifact_bound if {
  input.requires_artifact_hash == true
  count(input.approval.artifact_hashes) > 0
  input.approval.artifact_hashes[_] == input.artifact_hash
}

guardian_only if {
  input.actor == "guardian"
}

allow if {
  approval_complete
  action_in_scope
  subject_matches
  artifact_bound
  guardian_only
}

deny_reason := "approval_incomplete" if {
  not approval_complete
}

deny_reason := "action_out_of_scope" if {
  approval_complete
  not action_in_scope
}

deny_reason := "subject_mismatch" if {
  approval_complete
  not subject_matches
}

deny_reason := "artifact_hash_required" if {
  input.requires_artifact_hash == true
  not artifact_bound
}

deny_reason := "guardian_actor_required" if {
  input.actor != "guardian"
}
