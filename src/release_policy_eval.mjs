import { printSuiteResult, runPolicySuite } from "./policy_eval_engine.mjs";

const result = runPolicySuite({
  suite: "CORE_RELEASE_V1_0",
  policy: "policy/release_policy.rego",
  cases: "evals/release_cases.jsonl"
});

printSuiteResult(result, "Core release evals passed");
