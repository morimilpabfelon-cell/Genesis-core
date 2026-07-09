package genesis.release

default allow := false

approval_present if {
  input.approval.approved == true
  input.approval.approval_id != ""
  input.approval.approver == "guardian"
}

local_release_actions := {
  "run_core_hardening_check",
  "create_core_hardening_report",
  "create_release_manifest",
  "prepare_release_candidate",
  "verify_release_candidate"
}

governed_release_actions := {
  "freeze_core_release",
  "publish_seed_release",
  "supersede_core_release",
  "approve_release_for_birth_copy"
}

forbidden_release_actions := {
  "freeze_with_failed_hardening",
  "publish_with_blocked_terms",
  "include_runtime_in_core_release",
  "remove_growth_boundary",
  "remove_guardian_final_approval",
  "change_seed_without_new_version",
  "treat_release_freeze_as_growth_ceiling"
}

allow if {
  local_release_actions[input.action]
}

allow if {
  governed_release_actions[input.action]
  approval_present
}

deny_reason := "forbidden_release_action" if {
  forbidden_release_actions[input.action]
}

deny_reason := "guardian_approval_required" if {
  governed_release_actions[input.action]
  not approval_present
}
