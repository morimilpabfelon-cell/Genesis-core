import { printSuiteResult, runPolicySuite } from "./policy_eval_engine.mjs";

const result = runPolicySuite({
  suite: "LIVING_MEMORY_V0_2",
  policy: "policy/memory_policy.rego",
  cases: "evals/living_memory_cases.jsonl"
});

printSuiteResult(result, "Living memory evals passed");
