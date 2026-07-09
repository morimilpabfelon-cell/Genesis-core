import { printSuiteResult, runPolicySuite } from "./policy_eval_engine.mjs";

const result = runPolicySuite({
  suite: "GROWTH_ENGINE_V0_8",
  policy: "policy/growth_policy.rego",
  cases: "evals/growth_cases.jsonl"
});

printSuiteResult(result, "Growth engine evals passed");
