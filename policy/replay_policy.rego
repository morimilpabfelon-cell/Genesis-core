package genesis.replay

default allow := false

local_replay_actions := {
  "canonicalize_object",
  "hash_canonical_object",
  "verify_event_hash",
  "verify_event_chain",
  "run_replay",
  "create_replay_result",
  "create_checkpoint",
  "quarantine_derived_view"
}

forbidden_replay_actions := {
  "hash_noncanonical_object",
  "trust_snapshot_without_replay",
  "rewrite_event_to_match_hash",
  "ignore_hash_mismatch",
  "treat_checkpoint_as_source_of_truth",
  "skip_broken_chain"
}

allow if {
  local_replay_actions[input.action]
}

deny_reason := "forbidden_replay_action" if {
  forbidden_replay_actions[input.action]
}
