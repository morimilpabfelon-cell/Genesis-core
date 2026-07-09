import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const file = path.join(root, "evals", "seed_copy_cases.jsonl");

const local = new Set([
  "create_seed_copy_manifest",
  "verify_seed_copy",
  "compare_seed_hashes",
  "create_verification_report",
  "prepare_birth_handoff_package"
]);

const governed = new Set([
  "use_seed_copy_for_birth",
  "approve_birth_handoff",
  "replace_planted_seed_copy",
  "export_seed_copy_outside_guardian_scope"
]);

const denied = new Set([
  "merge_runtime_into_seed",
  "rewrite_seed_copy_after_birth",
  "use_unverified_seed_copy_for_birth",
  "ignore_seed_hash_mismatch",
  "remove_doctrine_from_copy",
  "treat_runtime_as_doctrine"
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

console.log(JSON.stringify({ suite: "SEED_PORTABILITY_V0_9", total: cases.length, failed: failures.length, failures }, null, 2));

if (failures.length) process.exitCode = 1;
else console.log("Seed portability evals passed");
