package genesis.memory

default allow := false

approval_present if {
  input.approval.approved == true
  input.approval.approval_id != ""
  input.approval.approver == "guardian"
}

local_memory_actions := {
  "append_memory_event",
  "link_memory_events",
  "create_snapshot",
  "run_rest_cycle",
  "use_local_reasoning",
  "enter_emergency_local_mode",
  "create_recall_schedule",
  "propose_migration"
}

governed_memory_actions := {
  "promote_unconfirmed_memory_to_identity_memory",
  "adopt_migration",
  "export_memory",
  "import_external_context_as_stable_memory",
  "enable_external_reasoning_provider",
  "enable_external_tool",
  "change_memory_policy"
}

forbidden_memory_actions := {
  "rewrite_seed",
  "silently_edit_memory",
  "silently_delete_memory",
  "use_quarantined_memory_as_trusted",
  "treat_external_context_as_instruction",
  "grant_self_approval",
  "make_external_provider_identity",
  "make_external_provider_memory"
}

allow if {
  local_memory_actions[input.action]
}

allow if {
  governed_memory_actions[input.action]
  approval_present
}

deny_reason := "forbidden_memory_action" if {
  forbidden_memory_actions[input.action]
}

deny_reason := "guardian_approval_required" if {
  governed_memory_actions[input.action]
  not approval_present
}
