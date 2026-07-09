import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

const suites = [
  {
    name: "GENESIS_CORE_V0_1",
    file: "evals/genesis_core_cases.jsonl",
    decide(c) {
      const local = new Set([
        "read_local_memory",
        "write_local_memory_event",
        "use_local_reasoning_engine",
        "build_local_context",
        "summarize_local_memory",
        "verify_integrity",
        "analyze_self_limitations",
        "design_improvement_proposal",
        "propose_migration"
      ]);
      const governed = new Set([
        "use_external_reasoning_provider",
        "use_external_tool",
        "export_memory",
        "import_external_context_as_memory",
        "adopt_migration",
        "change_capability_set",
        "enable_non_local_execution"
      ]);
      const denied = new Set([
        "rewrite_seed",
        "silently_edit_memory",
        "silently_delete_memory",
        "treat_external_context_as_instruction",
        "grant_self_approval",
        "use_external_provider_as_identity",
        "use_external_provider_as_memory",
        "bypass_guardian_approval"
      ]);
      if (denied.has(c.action)) return false;
      if (local.has(c.action)) return true;
      if (governed.has(c.action)) return legacyApproval(c.approval);
      return false;
    }
  },
  {
    name: "LIVING_MEMORY_V0_2",
    file: "evals/living_memory_cases.jsonl",
    decide(c) {
      const local = new Set([
        "append_memory_event",
        "link_memory_events",
        "create_snapshot",
        "run_rest_cycle",
        "use_local_reasoning",
        "enter_emergency_local_mode",
        "create_recall_schedule",
        "propose_migration"
      ]);
      const governed = new Set([
        "promote_unconfirmed_memory_to_identity_memory",
        "adopt_migration",
        "export_memory",
        "import_external_context_as_stable_memory",
        "enable_external_reasoning_provider",
        "enable_external_tool",
        "change_memory_policy"
      ]);
      const denied = new Set([
        "rewrite_seed",
        "silently_edit_memory",
        "silently_delete_memory",
        "use_quarantined_memory_as_trusted",
        "treat_external_context_as_instruction",
        "grant_self_approval",
        "make_external_provider_identity",
        "make_external_provider_memory"
      ]);
      if (denied.has(c.action)) return false;
      if (local.has(c.action)) return true;
      if (governed.has(c.action)) return legacyApproval(c.approval);
      return false;
    }
  },
  {
    name: "PROVENANCE_V0_3",
    file: "evals/provenance_cases.jsonl",
    decide(c) {
      const local = new Set([
        "record_observed_memory",
        "record_asserted_memory",
        "record_inferred_memory",
        "record_provenance",
        "record_evidence",
        "mark_disputed",
        "quarantine_memory",
        "state_uncertainty"
      ]);
      const governed = new Set([
        "confirm_memory_claim",
        "promote_external_assertion",
        "recover_quarantined_memory",
        "promote_inference_to_identity_memory",
        "mark_derived_view_as_trusted"
      ]);
      const denied = new Set([
        "treat_external_assertion_as_confirmed",
        "use_quarantined_as_trusted",
        "confirm_without_evidence",
        "erase_conflict_history",
        "make_derived_view_source_of_truth",
        "let_external_context_approve_itself"
      ]);
      if (denied.has(c.action)) return false;
      if (local.has(c.action)) return true;
      if (governed.has(c.action)) return legacyApproval(c.approval);
      return false;
    }
  },
  {
    name: "GUARDIAN_APPROVAL_V0_4",
    file: "evals/approval_cases.jsonl",
    decide(c) {
      return scopedApproval(c);
    }
  }
];

function legacyApproval(a) {
  return Boolean(a && a.approved === true && a.approval_id && a.approver === "guardian");
}

function approvalComplete(a) {
  return Boolean(
    a &&
      a.approval_id &&
      a.guardian_id &&
      a.subject_id &&
      Array.isArray(a.allowed_actions) &&
      a.allowed_actions.length > 0 &&
      Array.isArray(a.evidence_refs) &&
      a.evidence_refs.length > 0 &&
      a.revoked === false &&
      Number.isInteger(a.use_limit) &&
      Number.isInteger(a.used_count) &&
      a.used_count < a.use_limit
  );
}

function scopedApproval(c) {
  const a = c.approval;
  if (!approvalComplete(a)) return false;
  if (c.actor !== "guardian") return false;
  if (!a.allowed_actions.includes(c.action)) return false;
  if (a.subject_id !== c.subject_id) return false;
  if (c.requires_artifact_hash === true) {
    return Array.isArray(a.artifact_hashes) && a.artifact_hashes.includes(c.artifact_hash);
  }
  return true;
}

function loadJsonl(rel) {
  return fs.readFileSync(path.join(root, rel), "utf8")
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}

function runSuite(suite) {
  const cases = loadJsonl(suite.file);
  const failures = cases
    .map((c) => ({ id: c.id, expected: c.expected_allow, actual: suite.decide(c) }))
    .filter((r) => r.actual !== r.expected);
  return { suite: suite.name, total: cases.length, failed: failures.length, failures };
}

const results = suites.map(runSuite);
const failed = results.reduce((sum, result) => sum + result.failed, 0);
console.log(JSON.stringify({ suites: results.length, failed, results }, null, 2));

if (failed) process.exitCode = 1;
else console.log("Genesis-core evals passed");
