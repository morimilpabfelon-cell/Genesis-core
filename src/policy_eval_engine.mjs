import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

function read(rel) {
  return fs.readFileSync(path.join(root, rel), "utf8");
}

function parseSet(text, setName) {
  const match = text.match(new RegExp(`${setName}\\s*:=\\s*\\{([\\s\\S]*?)\\}`, "m"));
  if (!match) return new Set();
  const values = [...match[1].matchAll(/"([^"]+)"/g)].map((m) => m[1]);
  return new Set(values);
}

function unionSets(text, patterns) {
  const names = [...text.matchAll(/^([a-zA-Z0-9_]+)\s*:=\s*\{/gm)]
    .map((m) => m[1])
    .filter((name) => patterns.some((pattern) => pattern.test(name)));
  const merged = new Set();
  for (const name of names) {
    for (const value of parseSet(text, name)) merged.add(value);
  }
  return merged;
}

export function loadPolicySets(policyRel) {
  const text = read(policyRel);
  return {
    policyRel,
    local: unionSets(text, [/^local_.*actions$/, /^local_allowed_actions$/]),
    governed: unionSets(text, [/^governed_.*actions$/, /^governed_actions$/]),
    forbidden: unionSets(text, [/^forbidden_.*actions$/, /^forbidden_actions$/])
  };
}

export function hasLegacyGuardianApproval(approval) {
  return Boolean(
    approval &&
      approval.approved === true &&
      approval.approval_id &&
      (approval.approver === "guardian" || approval.approver_id === "guardian")
  );
}

export function decideFromPolicySets(testCase, policySets) {
  if (policySets.forbidden.has(testCase.action)) return false;
  if (policySets.local.has(testCase.action)) return true;
  if (policySets.governed.has(testCase.action)) return hasLegacyGuardianApproval(testCase.approval);
  return false;
}

export function loadJsonl(rel) {
  return read(rel)
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}

export function runPolicySuite({ suite, policy, cases }) {
  const policySets = loadPolicySets(policy);
  const parsedCases = loadJsonl(cases);
  const failures = parsedCases
    .map((testCase) => ({
      id: testCase.id,
      expected: testCase.expected_allow,
      actual: decideFromPolicySets(testCase, policySets)
    }))
    .filter((result) => result.actual !== result.expected);

  return {
    suite,
    policy,
    cases: parsedCases.length,
    failed: failures.length,
    failures
  };
}

export function printSuiteResult(result, successMessage) {
  console.log(JSON.stringify(result, null, 2));
  if (result.failed) process.exitCode = 1;
  else console.log(successMessage);
}
