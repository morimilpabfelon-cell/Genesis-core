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
  "src/validate_seed.mjs",
  "src/eval_runner.mjs",
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
