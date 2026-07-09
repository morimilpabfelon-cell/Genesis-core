package genesis.memory

test_local_append_memory_event_allowed if {
  allow with input as {"action": "append_memory_event"}
}

test_local_reasoning_allowed_without_approval if {
  allow with input as {"action": "use_local_reasoning"}
}

test_forbidden_rewrite_seed_denied if {
  not allow with input as {"action": "rewrite_seed"}
}

test_forbidden_rewrite_seed_reason if {
  deny_reason == "forbidden_memory_action" with input as {"action": "rewrite_seed"}
}

test_governed_export_memory_denied_without_approval if {
  not allow with input as {
    "action": "export_memory",
    "approval": {"approved": false, "approval_id": "", "approver": ""}
  }
}

test_governed_export_memory_requires_guardian_reason if {
  deny_reason == "guardian_approval_required" with input as {
    "action": "export_memory",
    "approval": {"approved": false, "approval_id": "", "approver": ""}
  }
}

test_governed_export_memory_allowed_with_guardian_approval if {
  allow with input as {
    "action": "export_memory",
    "approval": {"approved": true, "approval_id": "approval_1", "approver": "guardian"}
  }
}

test_external_context_cannot_be_instruction if {
  not allow with input as {"action": "treat_external_context_as_instruction"}
}

test_external_provider_cannot_be_identity if {
  not allow with input as {"action": "make_external_provider_identity"}
}

test_quarantined_memory_cannot_be_trusted if {
  not allow with input as {"action": "use_quarantined_memory_as_trusted"}
}
