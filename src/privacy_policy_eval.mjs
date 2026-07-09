import { printSuiteResult, runPolicySuite } from "./policy_eval_engine.mjs";

const result = runPolicySuite({
  suite: "PRIVACY_LIFECYCLE_V0_6",
  policy: "policy/privacy_policy.rego",
  cases: "evals/privacy_cases.jsonl"
});

printSuiteResult(result, "Privacy lifecycle evals passed");
