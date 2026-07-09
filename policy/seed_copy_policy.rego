package genesis.seedcopy

default allow := false

approval_present if {
  input.approval.approved == true
  input.approval.approval_id != ""
  input.approval.approver == "guardian"
}

local_seed_copy_actions := {
  "create_seed_copy_manifest",
  "verify_seed_copy",
  "compare_seed_hashes",
  "create_verification_report",
  "prepare_birth_handoff_package"
}

governed_seed_copy_actions := {
  "use_seed_copy_for_birth",
  "approve_birth_handoff",
  "replace_planted_seed_copy",
  "export_seed_copy_outside_guardian_scope"
}

forbidden_seed_copy_actions := {
  "merge_runtime_into_seed",
  "rewrite_seed_copy_after_birth",
  "use_unverified_seed_copy_for_birth",
  "ignore_seed_hash_mismatch",
  "remove_doctrine_from_copy",
  "treat_runtime_as_doctrine"
}

allow if {
  local_seed_copy_actions[input.action]
}

allow if {
  governed_seed_copy_actions[input.action]
  approval_present
}

deny_reason := "forbidden_seed_copy_action" if {
  forbidden_seed_copy_actions[input.action]
}

deny_reason := "guardian_approval_required" if {
  governed_seed_copy_actions[input.action]
  not approval_present
}
