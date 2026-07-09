import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

const required = [
  "README.md",
  "package.json",
  "identity/genesis.identity.schema.json",
  "identity/example.identity.json",
  "doctrine/core_doctrine.md",
  "doctrine/evolution_rules.md",
  "policy/core_policy.rego",
  "policy/memory_policy.rego",
  "policy/provenance_policy.rego",
  "ontology/memory_kinds.md",
  "ontology/brain_architecture.md",
  "ontology/memory_lifecycle.md",
  "ontology/epistemic_states.md",
  "ontology/provenance.md",
  "contracts/memory_event.schema.json",
  "contracts/knowledge_capsule.schema.json",
  "contracts/reasoning_provider.schema.json",
  "contracts/migration_proposal.schema.json",
  "contracts/audit_event.schema.json",
  "contracts/living_memory_event.schema.json",
  "contracts/memory_link.schema.json",
  "contracts/memory_snapshot.schema.json",
  "contracts/recall_schedule.schema.json",
  "contracts/rest_cycle.schema.json",
  "contracts/local_reasoning_mode.schema.json",
  "contracts/brain_health_report.schema.json",
  "contracts/provenance_record.schema.json",
  "contracts/epistemic_memory_event.schema.json",
  "contracts/evidence_record.schema.json",
  "state/genesis_lifecycle.mermaid",
  "evals/genesis_core_cases.jsonl",
  "evals/living_memory_cases.jsonl",
  "evals/provenance_cases.jsonl",
  "src/validate_seed.mjs",
  "src/eval_runner.mjs",
  "src/memory_policy_eval.mjs",
  "src/provenance_policy_eval.mjs"
];

const blocked = [
  ["Mori", "mil"],
  ["Olla", "ma"],
  ["And", "roid"],
  ["Ro", "om"],
  ["Kot", "lin"],
  ["Chat", "GPT"],
  ["Open", "AI"]
].map((parts) => parts.join(""));

function read(rel) {
  return fs.readFileSync(path.join(root, rel), "utf8");
}

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.name === ".git" || entry.name === "node_modules") return [];
    if (entry.isDirectory()) return walk(full);
    return [full];
  });
}

const missing = required.filter((rel) => !fs.existsSync(path.join(root, rel)));
if (missing.length) {
  console.error("Missing required files:", missing);
  process.exitCode = 1;
} else {
  console.log("All required files exist");
}

for (const rel of required.filter((name) => name.endsWith(".json"))) {
  JSON.parse(read(rel));
}

for (const rel of required.filter((name) => name.endsWith(".jsonl"))) {
  read(rel).split(/\r?\n/).filter(Boolean).forEach((line, index) => {
    try {
      JSON.parse(line);
    } catch (error) {
      throw new Error(`${rel}:${index + 1}: ${error.message}`);
    }
  });
}

const scanned = walk(root).filter((full) => /\.(md|json|jsonl|rego|mjs|mermaid)$/.test(full));
const violations = [];
for (const full of scanned) {
  const rel = path.relative(root, full).replaceAll("\\\\", "/");
  const text = fs.readFileSync(full, "utf8");
  for (const term of blocked) {
    if (text.includes(term)) violations.push(`${rel}: ${term}`);
  }
}

if (violations.length) {
  console.error("Blocked terms found:", violations);
  process.exitCode = 1;
} else {
  console.log("No blocked product or provider terms found");
}

const identity = JSON.parse(read("identity/example.identity.json"));
if (identity.reasoning_boundary.local_engine_allowed_without_extra_approval !== true) {
  throw new Error("Local reasoning engine must be allowed without extra approval");
}
if (identity.reasoning_boundary.external_provider_requires_guardian_approval !== true) {
  throw new Error("External provider must require guardian approval");
}
if (identity.reasoning_boundary.provider_is_not_identity !== true || identity.reasoning_boundary.provider_is_not_memory !== true) {
  throw new Error("Provider must not be identity or memory");
}

const localMode = JSON.parse(read("contracts/local_reasoning_mode.schema.json"));
if (localMode.properties.available_without_external_provider.const !== true) {
  throw new Error("Local reasoning mode must remain available without external provider");
}

const snapshot = JSON.parse(read("contracts/memory_snapshot.schema.json"));
if (!snapshot.required.includes("included_event_ids") || !snapshot.required.includes("excluded_event_ids")) {
  throw new Error("Snapshot must track included and excluded source events");
}

const epistemic = JSON.parse(read("contracts/epistemic_memory_event.schema.json"));
const states = epistemic.properties.epistemic_state.enum;
for (const state of ["observed", "asserted", "inferred", "confirmed", "corrected", "disputed", "quarantined"]) {
  if (!states.includes(state)) throw new Error(`Missing epistemic state: ${state}`);
}

const provenance = JSON.parse(read("contracts/provenance_record.schema.json"));
const trustTiers = provenance.properties.source_trust_tier.enum;
for (const tier of ["guardian_confirmed", "local_verified", "external_untrusted", "derived", "quarantine_only"]) {
  if (!trustTiers.includes(tier)) throw new Error(`Missing source trust tier: ${tier}`);
}

if (!process.exitCode) console.log("Genesis seed validation passed");
