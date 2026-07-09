package genesis.growth

default allow := false

approval_present if {
  input.approval.approved == true
  input.approval.approval_id != ""
  input.approval.approver == "guardian"
}

local_growth_actions := {
  "detect_self_limitation",
  "record_improvement_signal",
  "analyze_failure",
  "compare_growth_options",
  "draft_resource_request",
  "draft_capability_blueprint",
  "prepare_growth_package",
  "request_guardian_review"
}

governed_growth_actions := {
  "adopt_growth_package",
  "enable_new_capability",
  "change_runtime_structure",
  "connect_governed_resource",
  "increase_external_boundary",
  "apply_growth_migration",
  "change_growth_policy"
}

forbidden_growth_actions := {
  "self_adopt_growth_package",
  "self_enable_new_capability",
  "bypass_guardian_for_growth",
  "hide_growth_risk",
  "claim_unverified_capability",
  "rewrite_seed_for_growth",
  "remove_growth_rollback_plan"
}

allow if {
  local_growth_actions[input.action]
}

allow if {
  governed_growth_actions[input.action]
  approval_present
}

deny_reason := "forbidden_growth_action" if {
  forbidden_growth_actions[input.action]
}

deny_reason := "guardian_approval_required" if {
  governed_growth_actions[input.action]
  not approval_present
}
