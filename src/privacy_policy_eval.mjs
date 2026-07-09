import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const file = path.join(root, "evals", "privacy_cases.jsonl");

const local = new Set([
  "propose_redaction",
  "propose_tombstone",
  "propose_retention_rule",
  "read_active_memory",
  "read_audit_marker",
  "archive_low_relevance_derived_view",
  "mark_sensitive_for_review"
]);

const governed = new Set([
  "apply_redaction",
  "apply_tombstone",
  "restore_redacted_memory",
  "restore_tombstoned_memory",
  "export_sensitive_memory",
  "change_retention_rule",
  "broaden_retrieval_scope"
]);

const denied = new Set([
  "silently_delete_memory",
  "erase_audit_marker",
  "redact_without_record",
  "tombstone_without_record",
  "restore_without_guardian_approval",
  "export_without_guardian_approval",
  "rewrite_chain_for_privacy"
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

console.log(JSON.stringify({ suite: "PRIVACY_LIFECYCLE_V0_6", total: cases.length, failed: failures.length, failures }, null, 2));

if (failures.length) process.exitCode = 1;
else console.log("Privacy lifecycle evals passed");
