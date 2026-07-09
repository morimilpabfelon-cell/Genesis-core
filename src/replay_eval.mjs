import fs from "node:fs";
import path from "node:path";
import { canonicalHash } from "./canonical_json.mjs";

const root = process.cwd();
const file = path.join(root, "evals", "replay_cases.jsonl");

const policyAllowed = new Set([
  "canonicalize_object",
  "hash_canonical_object",
  "verify_event_hash",
  "verify_event_chain",
  "run_replay",
  "create_replay_result",
  "create_checkpoint",
  "quarantine_derived_view"
]);

const policyDenied = new Set([
  "hash_noncanonical_object",
  "trust_snapshot_without_replay",
  "rewrite_event_to_match_hash",
  "ignore_hash_mismatch",
  "treat_checkpoint_as_source_of_truth",
  "skip_broken_chain"
]);

function decidePolicy(action) {
  if (policyDenied.has(action)) return false;
  if (policyAllowed.has(action)) return true;
  return false;
}

function replayStatus(events) {
  if (!Array.isArray(events) || events.length === 0) return "invalid_input";
  const hashes = new Map();
  for (const event of events) {
    const expectedPrevious = event.previous_event_ref ? hashes.get(event.previous_event_ref) : event.previous_event_hash;
    if (event !== events[0] && event.previous_event_ref && !expectedPrevious) return "broken_chain";
    if (event !== events[0] && event.previous_event_hash && ![...hashes.values()].includes(event.previous_event_hash)) return "broken_chain";
    if (event === events[0] && event.previous_event_hash !== null) return "broken_chain";
    hashes.set(event.event_id, canonicalHash(event, ["event_hash", "previous_event_ref"]));
  }
  return "verified";
}

function evaluate(testCase) {
  if (testCase.kind === "canonical_hash") {
    const left = canonicalHash(testCase.left, testCase.exclude_fields || []);
    const right = canonicalHash(testCase.right, testCase.exclude_fields || []);
    return (left === right) === testCase.expected_equal;
  }
  if (testCase.kind === "replay") {
    return replayStatus(testCase.events) === testCase.expected_status;
  }
  if (testCase.kind === "policy") {
    return decidePolicy(testCase.action) === testCase.expected_allow;
  }
  return false;
}

const cases = fs.readFileSync(file, "utf8")
  .split(/\r?\n/)
  .filter(Boolean)
  .map((line) => JSON.parse(line));

const failures = cases
  .map((c) => ({ id: c.id, passed: evaluate(c) }))
  .filter((r) => !r.passed);

console.log(JSON.stringify({ suite: "DETERMINISTIC_REPLAY_V0_5", total: cases.length, failed: failures.length, failures }, null, 2));

if (failures.length) process.exitCode = 1;
else console.log("Deterministic replay evals passed");
