import { printSuiteResult, runPolicySuite } from "./policy_eval_engine.mjs";

const result = runPolicySuite({
  suite: "BRAIN_HEALTH_V0_7",
  policy: "policy/health_policy.rego",
  cases: "evals/health_cases.jsonl"
});

printSuiteResult(result, "Brain health evals passed");
