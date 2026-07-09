import { printSuiteResult, runPolicySuite } from "./policy_eval_engine.mjs";

const result = runPolicySuite({
  suite: "PROVENANCE_V0_3",
  policy: "policy/provenance_policy.rego",
  cases: "evals/provenance_cases.jsonl"
});

printSuiteResult(result, "Provenance evals passed");
