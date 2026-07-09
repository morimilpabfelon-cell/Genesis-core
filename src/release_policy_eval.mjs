import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const file = path.join(root, "evals", "release_cases.jsonl");

const local = new Set([
  "run_core_hardening_check",
  "create_core_hardening_report",
  "create_release_manifest",
  "prepare_release_candidate",
  "verify_release_candidate"
]);

const governed = new Set([
  "freeze_core_release",
  "publish_seed_release",
  "supersede_core_release",
  "approve_release_for_birth_copy"
]);

const denied = new Set([
  "freeze_with_failed_hardening",
  "publish_with_blocked_terms",
  "include_runtime_in_core_release",
  "remove_growth_boundary",
  "remove_guardian_final_approval",
  "change_seed_without_new_version",
  "treat_release_freeze_as_growth_ceiling"
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

console.log(JSON.stringify({ suite: "CORE_RELEASE_V1_0", total: cases.length, failed: failures.length, failures }, null, 2));

if (failures.length) process.exitCode = 1;
else console.log("Core release evals passed");
