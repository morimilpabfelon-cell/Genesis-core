import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const file = path.join(root, "evals", "growth_cases.jsonl");

const local = new Set([
  "detect_self_limitation",
  "record_improvement_signal",
  "analyze_failure",
  "compare_growth_options",
  "draft_resource_request",
  "draft_capability_blueprint",
  "prepare_growth_package",
  "request_guardian_review"
]);

const governed = new Set([
  "adopt_growth_package",
  "enable_new_capability",
  "change_runtime_structure",
  "connect_governed_resource",
  "increase_external_boundary",
  "apply_growth_migration",
  "change_growth_policy"
]);

const denied = new Set([
  "self_adopt_growth_package",
  "self_enable_new_capability",
  "bypass_guardian_for_growth",
  "hide_growth_risk",
  "claim_unverified_capability",
  "rewrite_seed_for_growth",
  "remove_growth_rollback_plan"
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

console.log(JSON.stringify({ suite: "GROWTH_ENGINE_V0_8", total: cases.length, failed: failures.length, failures }, null, 2));

if (failures.length) process.exitCode = 1;
else console.log("Growth engine evals passed");
