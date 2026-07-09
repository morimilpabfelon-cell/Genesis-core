import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const file = path.join(root, "evals", "health_cases.jsonl");

const local = new Set([
  "run_health_check",
  "detect_conflict",
  "record_conflict_report",
  "score_health_dimension",
  "propose_repair",
  "block_untrusted_context",
  "state_uncertainty",
  "recommend_guardian_review"
]);

const governed = new Set([
  "apply_correction",
  "apply_repair",
  "resolve_identity_conflict",
  "promote_disputed_claim",
  "restore_quarantined_context",
  "change_trusted_snapshot",
  "apply_structural_migration"
]);

const denied = new Set([
  "silently_resolve_conflict",
  "hide_critical_health_issue",
  "promote_disputed_claim_without_approval",
  "delete_conflicting_memory",
  "trust_stale_snapshot_as_current",
  "ignore_integrity_failure",
  "self_approve_repair"
]);

function approved(a) {
  return Boolean(a && a.approved === true && a.approval_id && a.approver === "guardian");
}

function allow(c) {
  if (denied.has(c.action)) return false;
  if (local.has(c.action)) return true;
  if (governed.has(c.action)) return approved(c.approval);
  return false;
}

const cases = fs.readFileSync(file, "utf8")
  .split(/\r?\n/)
  .filter(Boolean)
  .map((line) => JSON.parse(line));

const failures = cases
  .map((c) => ({ id: c.id, expected: c.expected_allow, actual: allow(c) }))
  .filter((r) => r.actual !== r.expected);

console.log(JSON.stringify({ suite: "BRAIN_HEALTH_V0_7", total: cases.length, failed: failures.length, failures }, null, 2));

if (failures.length) process.exitCode = 1;
else console.log("Brain health evals passed");
