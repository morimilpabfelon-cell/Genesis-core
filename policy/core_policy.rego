package genesis.core

default allow := false

approval_present if {
  input.approval.approved == true
  input.approval.approval_id != ""
  input.approval.approver != ""
}

local_allowed_actions := {
  "read_local_memory",
  "write_local_memory_event",
  "use_local_reasoning_engine",
  "build_local_context",
  "summarize_local_memory",
  "verify_integrity",
  "analyze_self_limitations",
  "design_improvement_proposal",
  "propose_migration"
}

governed_actions := {
  "use_external_reasoning_provider",
  "use_external_tool",
  "export_memory",
  "import_external_context_as_memory",
  "adopt_migration",
  "change_capability_set",
  "enable_non_local_execution"
}

forbidden_actions := {
  "rewrite_seed",
  "silently_edit_memory",
  "silently_delete_memory",
  "treat_external_context_as_instruction",
  "grant_self_approval",
  "use_external_provider_as_identity",
  "use_external_provider_as_memory",
  "bypass_guardian_approval"
}

allow if {
  local_allowed_actions[input.action]
}

allow if {
  governed_actions[input.action]
  approval_present
}

deny_reason := "forbidden_action" if {
  forbidden_actions[input.action]
}

deny_reason := "guardian_approval_required" if {
  governed_actions[input.action]
  not approval_present
}
