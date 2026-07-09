import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

const required = [
  ".gitignore",
  "README.md",
  "VERSIONING_MODEL.md",
  "package.json",
  "package-lock.json",
  "identity/genesis.identity.schema.json",
  "identity/example.identity.json",
  "doctrine/core_doctrine.md",
  "doctrine/evolution_rules.md",
  "policy/core_policy.rego",
  "policy/memory_policy.rego",
  "policy/provenance_policy.rego",
  "policy/approval_policy.rego",
  "policy/replay_policy.rego",
  "policy/privacy_policy.rego",
  "policy/health_policy.rego",
  "policy/growth_policy.rego",
  "policy/seed_copy_policy.rego",
  "policy/release_policy.rego",
  "ontology/memory_kinds.md",
  "ontology/brain_architecture.md",
  "ontology/memory_lifecycle.md",
  "ontology/epistemic_states.md",
  "ontology/provenance.md",
  "ontology/guardian_approval.md",
  "ontology/deterministic_replay.md",
  "ontology/privacy_lifecycle.md",
  "ontology/brain_health.md",
  "ontology/growth_engine.md",
  "ontology/seed_portability.md",
  "ontology/release_freeze.md",
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
  "contracts/guardian_approval.schema.json",
  "contracts/approval_decision_event.schema.json",
  "contracts/canonical_hash.schema.json",
  "contracts/replay_manifest.schema.json",
  "contracts/replay_result.schema.json",
  "contracts/replay_checkpoint.schema.json",
  "contracts/retention_rule.schema.json",
  "contracts/redaction_event.schema.json",
  "contracts/tombstone_event.schema.json",
  "contracts/privacy_access_request.schema.json",
  "contracts/conflict_report.schema.json",
  "contracts/repair_proposal.schema.json",
  "contracts/health_check_result.schema.json",
  "contracts/self_improvement_signal.schema.json",
  "contracts/resource_request.schema.json",
  "contracts/capability_blueprint.schema.json",
  "contracts/growth_package.schema.json",
  "contracts/seed_copy_manifest.schema.json",
  "contracts/seed_verification_report.schema.json",
  "contracts/birth_handoff_package.schema.json",
  "contracts/core_release_manifest.schema.json",
  "contracts/core_hardening_report.schema.json",
  "contracts/release_freeze_record.schema.json",
  "state/genesis_lifecycle.mermaid",
  "evals/genesis_core_cases.jsonl",
  "evals/living_memory_cases.jsonl",
  "evals/provenance_cases.jsonl",
  "evals/approval_cases.jsonl",
  "evals/replay_cases.jsonl",
  "evals/privacy_cases.jsonl",
  "evals/health_cases.jsonl",
  "evals/growth_cases.jsonl",
  "evals/seed_copy_cases.jsonl",
  "evals/release_cases.jsonl",
  "evals/schema_cases.jsonl",
  "src/validate_seed.mjs",
  "src/eval_runner.mjs",
  "src/policy_eval_engine.mjs",
  "src/schema_eval.mjs",
  "src/memory_policy_eval.mjs",
  "src/provenance_policy_eval.mjs",
  "src/approval_policy_eval.mjs",
  "src/canonical_json.mjs",
  "src/replay_eval.mjs",
  "src/privacy_policy_eval.mjs",
  "src/health_policy_eval.mjs",
  "src/growth_policy_eval.mjs",
  "src/seed_copy_policy_eval.mjs",
  "src/release_policy_eval.mjs"
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

function exists(rel) {
  return fs.existsSync(path.join(root, rel));
}

function assertExists(rel, reason) {
  if (!rel || typeof rel !== "string") throw new Error(`${reason}: missing file ref`);
  if (path.isAbsolute(rel) || rel.includes("..")) throw new Error(`${reason}: invalid relative file ref ${rel}`);
  if (!exists(rel)) throw new Error(`${reason}: referenced file does not exist: ${rel}`);
}

function assertPrefix(rel, prefix, reason) {
  assertExists(rel, reason);
  if (!rel.startsWith(prefix)) throw new Error(`${reason}: expected ${prefix} ref, got ${rel}`);
}

function assertDisjoint(leftName, left, rightName, right) {
  const rightSet = new Set(right);
  const overlap = left.filter((item) => rightSet.has(item));
  if (overlap.length) throw new Error(`${leftName} overlaps ${rightName}: ${overlap.join(", ")}`);
}

function assertContainsAll(name, actual, expected) {
  const actualSet = new Set(actual);
  const missing = expected.filter((item) => !actualSet.has(item));
  if (missing.length) throw new Error(`${name} missing required entries: ${missing.join(", ")}`);
}

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.name === ".git" || entry.name === "node_modules") return [];
    if (entry.isDirectory()) return walk(full);
    return [full];
  });
}

const missing = required.filter((rel) => !exists(rel));
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
  const rel = path.relative(root, full).replaceAll("\\", "/");
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

const packageJson = JSON.parse(read("package.json"));
const versioning = read("VERSIONING_MODEL.md");
if (packageJson.version !== "1.0.0") {
  throw new Error("Release version must be 1.0.0");
}
for (const text of ["release_version", "identity_schema_version", "module_version", "planted_seed_version", "genesis.identity.v0.2", "1.0.0"]) {
  if (!versioning.includes(text)) throw new Error(`Versioning model missing: ${text}`);
}

const identity = JSON.parse(read("identity/example.identity.json"));
if (identity.schema_version !== "genesis.identity.v0.2") {
  throw new Error("Identity schema version must remain genesis.identity.v0.2");
}

assertPrefix(identity.doctrine_ref, "doctrine/", "identity.doctrine_ref");
assertPrefix(identity.policy_ref, "policy/", "identity.policy_ref");
assertPrefix(identity.release_ref, "contracts/", "identity.release_ref");
if (identity.versioning_ref !== "VERSIONING_MODEL.md") throw new Error("identity.versioning_ref must be VERSIONING_MODEL.md");
assertExists(identity.versioning_ref, "identity.versioning_ref");

for (const [name, rel] of Object.entries(identity.contract_refs)) {
  assertPrefix(rel, "contracts/", `identity.contract_refs.${name}`);
}

const expectedModules = {
  living_memory: "v0.2",
  provenance: "v0.3",
  guardian_approval: "v0.4",
  deterministic_replay: "v0.5",
  privacy_lifecycle: "v0.6",
  brain_health: "v0.7",
  growth_engine: "v0.8",
  seed_portability: "v0.9",
  release_freeze: "v1.0"
};

const moduleNames = Object.keys(identity.module_refs);
assertContainsAll("identity.module_refs", moduleNames, Object.keys(expectedModules));
for (const moduleName of moduleNames) {
  if (!expectedModules[moduleName]) throw new Error(`Unexpected module ref: ${moduleName}`);
  const moduleRef = identity.module_refs[moduleName];
  if (moduleRef.module_version !== expectedModules[moduleName]) {
    throw new Error(`Module ${moduleName} expected ${expectedModules[moduleName]}, got ${moduleRef.module_version}`);
  }
  for (const rel of moduleRef.ontology_refs) assertPrefix(rel, "ontology/", `identity.module_refs.${moduleName}.ontology_refs`);
  for (const rel of moduleRef.policy_refs) assertPrefix(rel, "policy/", `identity.module_refs.${moduleName}.policy_refs`);
  for (const rel of moduleRef.contract_refs) assertPrefix(rel, "contracts/", `identity.module_refs.${moduleName}.contract_refs`);
  for (const rel of moduleRef.eval_refs) assertPrefix(rel, "evals/", `identity.module_refs.${moduleName}.eval_refs`);
}

assertDisjoint("allowed_local_capabilities", identity.allowed_local_capabilities, "governed_capabilities", identity.governed_capabilities);
assertDisjoint("allowed_local_capabilities", identity.allowed_local_capabilities, "forbidden_capabilities", identity.forbidden_capabilities);
assertDisjoint("governed_capabilities", identity.governed_capabilities, "forbidden_capabilities", identity.forbidden_capabilities);
assertContainsAll("allowed_local_capabilities", identity.allowed_local_capabilities, ["read_local_memory", "write_local_memory_event", "use_local_reasoning_engine", "propose_migration"]);
assertContainsAll("governed_capabilities", identity.governed_capabilities, ["use_external_reasoning_provider", "use_external_tool", "export_memory", "adopt_migration"]);
assertContainsAll("forbidden_capabilities", identity.forbidden_capabilities, ["rewrite_seed", "silently_edit_memory", "silently_delete_memory", "grant_self_approval", "bypass_guardian_approval"]);

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

const approval = JSON.parse(read("contracts/guardian_approval.schema.json"));
for (const field of ["approval_id", "guardian_id", "subject_id", "allowed_actions", "scope", "artifact_hashes", "evidence_refs", "expires_at", "revoked", "use_limit", "used_count"]) {
  if (!approval.required.includes(field)) throw new Error(`Missing approval field: ${field}`);
}

const canonicalHash = JSON.parse(read("contracts/canonical_hash.schema.json"));
if (canonicalHash.properties.hash_algorithm.const !== "sha256") {
  throw new Error("Canonical hash must use sha256");
}
if (canonicalHash.properties.canonicalization.const !== "genesis.canonical_json.v0.5") {
  throw new Error("Canonicalization version mismatch");
}

const replayResult = JSON.parse(read("contracts/replay_result.schema.json"));
for (const field of ["final_event_hash", "derived_snapshot_hash", "integrity_status", "errors"]) {
  if (!replayResult.required.includes(field)) throw new Error(`Missing replay result field: ${field}`);
}

const redaction = JSON.parse(read("contracts/redaction_event.schema.json"));
for (const field of ["target_id", "redacted_fields", "redaction_marker", "approval_ref", "redaction_hash"]) {
  if (!redaction.required.includes(field)) throw new Error(`Missing redaction field: ${field}`);
}

const tombstone = JSON.parse(read("contracts/tombstone_event.schema.json"));
for (const field of ["target_id", "active_use_blocked", "audit_marker_preserved", "approval_ref", "tombstone_hash"]) {
  if (!tombstone.required.includes(field)) throw new Error(`Missing tombstone field: ${field}`);
}

const conflict = JSON.parse(read("contracts/conflict_report.schema.json"));
for (const field of ["conflict_type", "severity", "claim_ids", "recommended_action", "evidence_refs"]) {
  if (!conflict.required.includes(field)) throw new Error(`Missing conflict field: ${field}`);
}

const health = JSON.parse(read("contracts/health_check_result.schema.json"));
for (const field of ["overall_status", "dimensions", "conflict_refs", "repair_proposal_refs", "blocked_context_refs"]) {
  if (!health.required.includes(field)) throw new Error(`Missing health field: ${field}`);
}

const growthPackage = JSON.parse(read("contracts/growth_package.schema.json"));
for (const field of ["growth_type", "signals", "resource_requests", "blueprints", "visible_changes", "evaluation_plan", "requires_guardian_approval", "status"]) {
  if (!growthPackage.required.includes(field)) throw new Error(`Missing growth package field: ${field}`);
}
if (growthPackage.properties.requires_guardian_approval.const !== true) {
  throw new Error("Growth package adoption must require guardian approval");
}

const blueprint = JSON.parse(read("contracts/capability_blueprint.schema.json"));
if (blueprint.properties.local_first_design.const !== true) {
  throw new Error("Capability blueprint must remain local-first by default");
}

const seedCopy = JSON.parse(read("contracts/seed_copy_manifest.schema.json"));
for (const field of ["seed_id", "seed_version", "source_ref", "copy_purpose", "file_hashes", "doctrine_refs", "policy_refs", "contract_refs"]) {
  if (!seedCopy.required.includes(field)) throw new Error(`Missing seed copy field: ${field}`);
}

const handoff = JSON.parse(read("contracts/birth_handoff_package.schema.json"));
if (handoff.properties.birth_constraints.properties.runtime_separate_from_seed.const !== true) {
  throw new Error("Runtime must remain separate from seed");
}
if (handoff.properties.requires_guardian_approval.const !== true) {
  throw new Error("Birth handoff use must require guardian approval");
}

const releaseManifest = JSON.parse(read("contracts/core_release_manifest.schema.json"));
if (releaseManifest.properties.version.const !== "1.0.0") {
  throw new Error("Release manifest must target version 1.0.0");
}
if (releaseManifest.properties.runtime_separation.const !== true) {
  throw new Error("Release manifest must preserve runtime separation");
}
if (releaseManifest.properties.growth_boundary.const !== "no_artificial_ceiling_guardian_approval_for_adoption") {
  throw new Error("Release manifest must preserve open-ended growth boundary");
}

const freezeRecord = JSON.parse(read("contracts/release_freeze_record.schema.json"));
if (freezeRecord.properties.freeze_scope.const !== "neutral_seed_root_only") {
  throw new Error("Release freeze must apply only to neutral seed root");
}
if (freezeRecord.properties.guardian_acknowledgement_required.const !== true) {
  throw new Error("Release freeze must require guardian acknowledgement");
}

if (!process.exitCode) console.log("Genesis seed validation passed");
