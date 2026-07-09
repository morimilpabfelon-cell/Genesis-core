import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const file = path.join(root, "evals", "provenance_cases.jsonl");

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

function hasApproval(a) {
  return Boolean(a && a.approved === true && a.approval_id && a.approver === "guardian");
}

function allow(c) {
  if (denied.has(c.action)) return false;
  if (local.has(c.action)) return true;
  if (governed.has(c.action)) return hasApproval(c.approval);
  return false;
}

const cases = fs.readFileSync(file, "utf8")
  .split(/\r?\n/)
  .filter(Boolean)
  .map((line) => JSON.parse(line));

const failures = cases
  .map((c) => ({ id: c.id, expected: c.expected_allow, actual: allow(c) }))
  .filter((r) => r.actual !== r.expected);

console.log(JSON.stringify({ suite: "PROVENANCE_V0_3", total: cases.length, failed: failures.length, failures }, null, 2));

if (failures.length) process.exitCode = 1;
else console.log("Provenance evals passed");
