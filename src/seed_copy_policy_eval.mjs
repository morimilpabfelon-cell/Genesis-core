import { printSuiteResult, runPolicySuite } from "./policy_eval_engine.mjs";

const result = runPolicySuite({
  suite: "SEED_PORTABILITY_V0_9",
  policy: "policy/seed_copy_policy.rego",
  cases: "evals/seed_copy_cases.jsonl"
});

printSuiteResult(result, "Seed portability evals passed");
