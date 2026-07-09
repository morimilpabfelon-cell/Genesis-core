import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const file = path.join(root, "evals", "approval_cases.jsonl");

function complete(a) {
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

function allow(c) {
  const a = c.approval;
  if (!complete(a)) return false;
  if (c.actor !== "guardian") return false;
  if (!a.allowed_actions.includes(c.action)) return false;
  if (a.subject_id !== c.subject_id) return false;
  if (c.requires_artifact_hash === true) {
    return Array.isArray(a.artifact_hashes) && a.artifact_hashes.includes(c.artifact_hash);
  }
  return true;
}

const cases = fs.readFileSync(file, "utf8")
  .split(/\r?\n/)
  .filter(Boolean)
  .map((line) => JSON.parse(line));

const failures = cases
  .map((c) => ({ id: c.id, expected: c.expected_allow, actual: allow(c) }))
  .filter((r) => r.actual !== r.expected);

console.log(JSON.stringify({ suite: "GUARDIAN_APPROVAL_V0_4", total: cases.length, failed: failures.length, failures }, null, 2));

if (failures.length) process.exitCode = 1;
else console.log("Guardian approval evals passed");
