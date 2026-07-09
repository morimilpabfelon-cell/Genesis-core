import { loadJsonl, loadPolicySets, decideFromPolicySets } from "./policy_eval_engine.mjs";

const suites = [
  {
    name: "GENESIS_CORE_V0_1",
    cases: "evals/genesis_core_cases.jsonl",
    policy: "policy/core_policy.rego",
    decide(testCase, policySets) {
      return decideFromPolicySets(testCase, policySets);
    }
  },
  {
    name: "LIVING_MEMORY_V0_2",
    cases: "evals/living_memory_cases.jsonl",
    policy: "policy/memory_policy.rego",
    decide(testCase, policySets) {
      return decideFromPolicySets(testCase, policySets);
    }
  },
  {
    name: "PROVENANCE_V0_3",
    cases: "evals/provenance_cases.jsonl",
    policy: "policy/provenance_policy.rego",
    decide(testCase, policySets) {
      return decideFromPolicySets(testCase, policySets);
    }
  },
  {
    name: "GUARDIAN_APPROVAL_V0_4",
    cases: "evals/approval_cases.jsonl",
    decide(testCase) {
      return scopedApproval(testCase);
    }
  }
];

function approvalComplete(approval) {
  return Boolean(
    approval &&
      approval.approval_id &&
      approval.guardian_id &&
      approval.subject_id &&
      Array.isArray(approval.allowed_actions) &&
      approval.allowed_actions.length > 0 &&
      Array.isArray(approval.evidence_refs) &&
      approval.evidence_refs.length > 0 &&
      approval.revoked === false &&
      Number.isInteger(approval.use_limit) &&
      Number.isInteger(approval.used_count) &&
      approval.used_count < approval.use_limit
  );
}

function scopedApproval(testCase) {
  const approval = testCase.approval;
  if (!approvalComplete(approval)) return false;
  if (testCase.actor !== "guardian") return false;
  if (!approval.allowed_actions.includes(testCase.action)) return false;
  if (approval.subject_id !== testCase.subject_id) return false;
  if (testCase.requires_artifact_hash === true) {
    return Array.isArray(approval.artifact_hashes) && approval.artifact_hashes.includes(testCase.artifact_hash);
  }
  return true;
}

function runSuite(suite) {
  const cases = loadJsonl(suite.cases);
  const policySets = suite.policy ? loadPolicySets(suite.policy) : null;
  const failures = cases
    .map((testCase) => ({
      id: testCase.id,
      expected: testCase.expected_allow,
      actual: suite.decide(testCase, policySets)
    }))
    .filter((result) => result.actual !== result.expected);
  return { suite: suite.name, total: cases.length, failed: failures.length, failures };
}

const results = suites.map(runSuite);
const failed = results.reduce((sum, result) => sum + result.failed, 0);
console.log(JSON.stringify({ suites: results.length, failed, results }, null, 2));

if (failed) process.exitCode = 1;
else console.log("Genesis-core evals passed");
