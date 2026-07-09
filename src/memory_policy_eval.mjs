import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const file = path.join(root, "evals", "living_memory_cases.jsonl");

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

console.log(JSON.stringify({ suite: "LIVING_MEMORY_V0_2", total: cases.length, failed: failures.length, failures }, null, 2));

if (failures.length) process.exitCode = 1;
else console.log("Living memory evals passed");
