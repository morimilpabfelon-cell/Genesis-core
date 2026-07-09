import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const file = path.join(root, "evals", "genesis_core_cases.jsonl");

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
  "use_external_provider_as_memory"
]);

function hasApproval(a) {
  return Boolean(a && a.approved === true && a.approval_id && a.approver && a.approver === "guardian");
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

console.log(JSON.stringify({ suite: "GENESIS_CORE_V0_1", total: cases.length, failed: failures.length, failures }, null, 2));

if (failures.length) process.exitCode = 1;
else console.log("Genesis core evals passed");
